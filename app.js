const debug = require('debug')('app:inicio');
//const dbDegub = require('debug')('app:db');
const express = require('express');
const Joi = require('@hapi/joi');
const morgan = require('morgan');
const config = require('config');
//const logger = require('./logger');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//Config de entornos
console.log('Aplicacion: ' + config.get('nombre'));
console.log('BD Server: ' + config.get('configDB.host'));

//Uso middleware terceros - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    // console.log('Morgan habilitado');
    debug('Morgan está habilitado.');
}

//Trabajos bd
debug('Conectando con la base de datos...');

//app.use(logger);

// app.use(function(req, res, next){
//     console.log('Autenticando...');
//     next();
// })

const usuarios = [
    {id:1, nombre:'Juan'},
    {id:2, nombre:'Germán'},
    {id:3, nombre:'Cubedo'}
];

app.get('/', (req, res) => {
    res.send('Hola mundo desde Express.');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = usuarioExist(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no existe');
    }
    else{
        res.send(usuario);
    }
});

app.post('/api/usuarios', (req, res) => {

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    const {error, value} = validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
         id: usuarios.length + 1,
         nombre: value.nombre
        };

        usuarios.push(usuario);
        res.send(usuario);
    }
    else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }

    // if(!req.body.nombre || req.body.length <= 2){
    //     res.status(400).send('Debe ingresar un nombre');
    //     return;
    // }
});

app.put('/api/usuarios/:id', (req, res) => {
    let usuario = usuarioExist(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no existe');
        return;
    }
    
    const {error, value} = validarUsuario(req.body.nombre);
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = usuarioExist(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no existe');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
})

function usuarioExist(id){
    return(usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return(schema.validate({nombre: nom}))
}
// app.post();
// app.put();
// app.delete();
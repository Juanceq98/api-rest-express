const express = require('express');
const Joi = require('@hapi/joi');
const rutas =  express.Router();

const usuarios = [
    {id:1, nombre:'Juan'},
    {id:2, nombre:'Germán'},
    {id:3, nombre:'Cubedo'}
];

rutas.get('/', (req, res) => {
    res.send(usuarios);
});

rutas.get('/:id', (req, res) => {
    let usuario = usuarioExist(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no existe');
    }
    else{
        res.send(usuario);
    }
});

rutas.post('/', (req, res) => {

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

rutas.put('/:id', (req, res) => {
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

rutas.delete('/:id', (req, res) => {
    let usuario = usuarioExist(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no existe');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
});

function usuarioExist(id){
    return(usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return(schema.validate({nombre: nom}))
}

module.exports = rutas;
const debug = require('debug')('app:inicio');
//const dbDegub = require('debug')('app:db');
const express = require('express');
const usuarios = require('./routes/usuarios');
const morgan = require('morgan');
const config = require('config');
//const logger = require('./logger');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

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

app.get('/', (req, res) => {
    res.send('Hola mundo desde Express.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
})

// app.post();
// app.put();
// app.delete();
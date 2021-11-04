const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const logger = require('./logger');
const morgan =require('morgan');
const usuario= require('./routes/usuarios');
const config = require('config');
const app = express();


app.use(express.json()); //body 
app.use(express.urlencoded({extended:true})); //POST clave-valor opcion adicional a express.json
app.use(express.static("public"));
app.use('/api/usuarios', usuario);
//app.use(autenticar);
//app.use(logger);
//USO DE UN MIDDEWALRE DE TERCEROS --> 
const usuarios1 = [
    { id: 1, nombre: "Elder" },
    { id: 2, nombre: "Carlos" },
    { id: 3, nombre: "Maria" },
    { id: 4, nombre: "Esperanza" }
];
app.get('/', (req, res) => {
    res.send(usuarios1);
});
console.log("Aplicacion ", config.get('nombre'));
console.log("Server DB ", config.get('configDB.host'));
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));  // Salida de las consultas GET, POST DENTRO DE LA CONSOLA VISUALIZACIÓN
    //console.log("Morgan utilizado .......");
    debug('Morgan esta habilitado........');
}

debug('Conectando con la BD......');



app.get('/', (req, res) => {
    res.send("Hola mundo desde express");

});   // PETICION 


const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});


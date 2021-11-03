const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require('express');
const logger = require('./logger');
const morgan =require('morgan');
//const autenticar = require('./autenticated');
const Joi = require('joi');
const { urlencoded } = require('express');
const { extend } = require('joi');
const config = require('config');
const app = express();


app.use(express.json()); //body 
app.use(express.urlencoded({extended:true})); //POST clave-valor 
app.use(express.static("public"));
//app.use(autenticar);
//app.use(logger);
//USO DE UN MIDDEWALRE DE TERCEROS --> 

console.log("Aplicacion ", config.get('nombre'));
console.log("Server DB ", config.get('configDB.host'));
if(app.get('env')=== 'development'){
    app.use(morgan('tiny'));  // Salida de las consultas GET, POST DENTRO DE LA CONSOLA VISUALIZACIÓN
    //console.log("Morgan utilizado .......");
    debug('Morgan esta habilitado........');

}

debug('Conectando con la BD......');


const usuarios = [
    { id: 1, nombre: "Elder" },
    { id: 2, nombre: "Carlos" },
    { id: 3, nombre: "Maria" },
    { id: 4, nombre: "Esperanza" }
];

app.get('/', (req, res) => {
    res.send("Hola mundo desde express");

});   // PETICION 

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});
// app.get('/api/usuarios/:year/:mes',(req,res)=>{
//     res.send(req.query);
// });
app.get('/api/usuarios/:id', (req, res) => {
    let usuario = usuarios.find(dato => dato.id == req.params.id);
    if (!usuario) res.status(404).send(`EL usuario con el parametro ${req.params.id} no existe `);
    res.status(200).send(usuario.nombre);
});
app.post('/api/usuarios', (req, res) => {
   
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .max(30)
            .required(),
    });

    let { error, value } = schema.validate({ nombre: req.body.nombre });
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre,
        };
        usuarios.push(usuario);
        res.send(usuario);
        console.log("Valor del req.body", req.body);

    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        console.log("hubo un error ", mensaje);
    }


    // if(!req.body.nombre || req.body.nombre.length <= 2){
    //     //400 BAD REQUEST
    //     res.status(400).send("Debe ingresar un nombre que tenga minimo 3 letras");
    //     return;
    // }
    // const usuario ={
    //     id: usuarios.length+1,
    //     nombre:req.body.nombre,
    // };
    // usuarios.push(usuario);
    // res.send(usuario);
    // console.log("Valor del req.body", req.body);
});

app.put('/api/usuarios/:id', (req, res) => {
    //let usuario = usuarios.find(dato => dato.id == parseInt(req.params.id));
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send(`EL usuario con el parametro ${req.params.id} no existe `);
        return;
    }

    let { error, value } = validarUsuario(req.body.nombre);
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        console.log("hubo un error ", mensaje);
        return;
    }
    usuario.nombre = value.nombre;
    res.status(200).send(usuario);

});


app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(400).send(`El usuario no existe`);
        return;
    }

    let index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.status(200).send(usuarios);
});


function existeUsuario(id) {
    return usuarios.find(dato => dato.id == parseInt(id));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required(),
    });
    return schema.validate({ nombre: nom });
}

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});
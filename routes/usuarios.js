const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const usuarios = [
    { id: 1, nombre: "Elder" },
    { id: 2, nombre: "Carlos" },
    { id: 3, nombre: "Maria" },
    { id: 4, nombre: "Esperanza" }
];

ruta.get('/', (req, res) => {
    res.status(200).send(usuarios);
    return ;
});
ruta.get('/:id', (req, res) => {
    let usuario = usuarios.find(dato => dato.id == parseInt(req.params.id));
    if (!usuario) res.status(404).send(`EL usuario con el parametro ${req.params.id} no existe `);
    res.status(200).send(usuario.nombre);
});
ruta.post('/', (req, res) => {
   
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

ruta.put('/:id', (req, res) => {
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


ruta.delete('/:id', (req, res) => {
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

module.exports= ruta;
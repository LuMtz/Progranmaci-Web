const { error } = require('console');
const express = require('express');
const fs = require('fs');
const app = express();
const puerto = 3000;

app.use(express.static('public'));

app.get('/api/servicios', (req, res) =>{
    fs.readFile('datos.json', 'utf8', (error,data) => {
        if(error){
            res.status(500).send('Error al leer el archivo JSON');
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.listen(puerto, () =>{
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});

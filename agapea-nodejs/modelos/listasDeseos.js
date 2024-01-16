//Módulo js para definir un schema de mongoose para la coleccion de listas de deseos de un cliente

const mongoose = require('mongoose');

let listaDeseosSchema = new mongoose.Schema(
    {
        nombreLista: {type: String, required:[true,'* Nombre de la lista obligatorio'],maxLenght:[50,'*Maximo 50 caracteres']},
        libros:[
            {type: mongoose.Schema.Types.ObjectId, ref:'Libro'}
        ]
    }
);

module.exports=mongoose.model('ListaDeseos',listaDeseosSchema,'listasDeseos');

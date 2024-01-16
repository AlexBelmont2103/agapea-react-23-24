//schema mongoose para registrar los datos de un comentario de un libro
const mongoose=require('mongoose');
var comentarioSchema=new mongoose.Schema(
    {
        nombreUsuario:{type:String, required:[true,'* El id del cliente es obligatorio']},
        idLibro:{type:String, required:[true,'* El id del libro es obligatorio']},
        comentario:{type:String},
        valoracion:{type:Number, required:[true,'* La valoración es obligatoria']},
    }
);
module.exports=mongoose.model('Comentario',comentarioSchema,'comentarios');

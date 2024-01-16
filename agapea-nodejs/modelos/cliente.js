//Módulo de codigo para crearnos un schema mongoose para los datos a registrar de un cliente
//un schema mongoose sirve para construir objetos que se van a mapear contra documentos de una determinada coleccion

//schema ---------> objetos <=======> documento coleccion bd mongodb

//En estos schemas puedo meter reglas de validacion, puedo definir metodos estaticos, metodos de instancia
const mongoose=require('mongoose');

var clienteSchema=new mongoose.Schema(
    {
        nombre: {type: String, required:[true,'* Nombre obligatorio'],maxLenght:[50,'*Maximo 50 caracteres']},
        apellidos: {type: String, required:[true,'* Apellidos obligatorios'], maxLenght:[200,'*Maximo 200 caracteres']},
        cuenta: {
            email:{type:String, required:[true, '* Email obligatorio']}, 
            password:{type:String,required:[true,'* La contraseña es obligatoria'],minlength:[8,"* la contraseña debe tener al menos 8 caracteres"]}, 
            cuentaActiva:{type: Boolean,required:true, default:false}, 
            login:{type:String}, 
            imagenAvatarBASE64:{type:String}
            
        },
        telefono:{type:String,required:false},
        direcciones:[
           {type: mongoose.Schema.Types.ObjectId, ref:'Direccion'} 
        ],
        pedidos:[
            {type: mongoose.Schema.Types.ObjectId, ref:'Pedido'}
        ],
        comentarios:[
            {type: mongoose.Schema.Types.ObjectId, ref:'Comentario'}
        ],
        listasDeseos:[
            {type: mongoose.Schema.Types.ObjectId, ref:'ListaDeseos'}
        ]
    }
);

module.exports=mongoose.model('Cliente',clienteSchema,'clientes');
//1º argumento es el nombre de los objetos que se van a crear
//2º argumento el esquema que se usa como prototipo para crearlos
//3º argumento el nombre de la coleccion en la BD de mongodb con la que se mapean estos objetos
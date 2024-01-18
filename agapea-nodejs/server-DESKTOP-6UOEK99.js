//modulo principal de entrada del proyecto de node
//instalar EXPRESS: npm install express
//funciones con una pipeline de modules middleware que van procesando la peticion, la modifican y se la pasan al servidor
//Estos modulos middleware pueden ser çtercers (moduloes externos preconfigurados )o modulos
//autogenerado, como el enrutamiento
//todos los moduloes middleware son js con tres parametros (req, res, next)

require("dotenv").config(); //<--PAQUETE PARa definir como variable de entorno en fihcero .env valores criticos

const express = require("express"); //<-- en la variable express se almaacena la funccion q genera el servidor web, exportada por el modulo
var serverExpress = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const cors = require("cors");
const bcrypt = require('bcrypt');
const Mailjet = require('node-mailjet');
const jsonwebtoken = require('jsonwebtoken');
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
);
let Categoria = require("./modelos/categoria");
let Libro = require("./modelos/libro");
let Cliente = require("./modelos/cliente");
let Direcciones = require("./modelos/direccion");
let Pedido = require("./modelos/pedido");
let Comentario = require("./modelos/comentario");


//configuration de la pipeline
//middleware de terceros:
//-cookie-parser:extrae de la peticion del cliente http request, la cabecera Cookie, extrae su valor y lo mete en un prop del objeto req.cookie
//-body-parse:extrae de la pet del cliente http-request, del body los datos mandados en formato x-www-form-urlencoded o json e
//xtrae sy valor y los mete en una prop del objeto req.body
// -cors: para evitar errore cross-resource-sharing
serverExpress.use(cookieParser());
serverExpress.use(bodyParser.json());
serverExpress.use(bodyParser.urlencoded({ extended: true }));
serverExpress.use(cors());

//middleware propios:
// - enrutamiento

//-----------------------------------------

//#region endpoints de la api de cliente

serverExpress.post("/api/Cliente/Registro", async (req, res) => {
  try {
    console.log(
      "Datos recibidos por el cliente react en componente registro, por ajax...",
      req.body
    );

    //1º: Con los datos mandados por el componente de react, tenemos que insertarlos en la coleccion clientes de la bd de mongo
    var __resultInsert = await new Cliente({
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      cuenta: {
        email: req.body.email,
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, 10),
        cuentaActiva: false,
        imagenAvatarBASE64: "",
      },
      telefono: req.body.telefono,
    }).save();
    //2º: mandar email de activación con mailjet
    const idCliente = __resultInsert.id;
    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: "alejandromgarcia90@gmail.com",
                Name: "Agapea MERN"
              },
              To: [
                {
                  Email: `${__resultInsert.cuenta.email}`,
                  Name: `${__resultInsert.nombre} ${__resultInsert.apellidos}`
                }
              ],
              Subject: "Activa tu cuenta",
              TextPart: "Bienvenido a Agapea!!! Por favor, activa tu cuenta",
              HTMLPart: `<h3>Bienvenid@, ${__resultInsert.nombre}. Por favor activa tu cuenta pinchando <a href='http://localhost:5000/api/Cliente/ActivarCuenta/${idCliente}'>aquí!</a></h3>`
            }
          ]
        })
        request
    .then((result) => {
        console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })
    res
      .status(200) //Código de respuesta
      .send({
        //La respuesta que mandas
        codigo: 0,
        respuesta: "endpoint a la escucha para el registro de datos",
      });
  } catch (error) {
    console.log("error al hacer el insert en coleccion clientes", error);
    res.status(200).send({
      codigo: 0,
      mensaje: "error a la hora de insertar datos del cliente",
    });
  }
});

serverExpress.get('/api/Cliente/ActivarCuenta/:id', async (req, res)=>{
  console.log('Datos recibidos del email de confirmacion', req.params);
  const {id}=req.params;
  
  try{
    const __resultUpdate = await Cliente.findByIdAndUpdate(
      id,
      {"cuenta.cuentaActiva":true}
      
    );
    if(__resultUpdate){
     
      
      res.status(200).json({mensaje: 'Cuenta activada'})
    }else{
      res.status(404).json({mensaje: 'Usuario no encontrado'})
    }
  }catch{
    res.status(500).json({mensaje: 'Algo falló en el enlace'})
  }
})

serverExpress.post("/api/Cliente/Login", async (req, res) => {

  try{
    //1º comprobar que el cliente existe
    console.log("Datos recibidos por el cliente de React", req.body);
    const {email, password}=req.body;
    const _cliente = await Cliente.findOne({"cuenta.email":email})
                                  .populate(
                                    [
                                      {path:'direcciones', model:'Direccion'},
                                      {path:'pedidos', model:'Pedido'},
                                    ]
    );
    if(!_cliente) throw new Error('El cliente no existe');
    
     //2º comprobar que la password coincide con el hash
    if(bcrypt.compareSync(password, _cliente.cuenta.password)){
        //3º Comprobar si la cuenta está activa
        if(!_cliente.cuenta.cuentaActiva) throw new Error('La cuenta no está activa');
        //4º si todo ok, devolver datos expandidos y generar token de sesion

        let _jwt= jsonwebtoken.sign({nombre:_cliente.nombre, apellidos:_cliente.apellidos, email:_cliente.cuenta.email, idCliente:_cliente._id}, 
          process.env.JWT_SECRETKEY, {expiresIn: '1h', issuer: 'http://localhost:5000'});
        res.status(200).send({
          codigo: 0,
          mensaje: "login correcto",
          error: null,
          datoscliente: _cliente,
          tokensesion:_jwt,
          otrodatos:null
        });
    }else{
      throw new Error('La contraseña no coincide');
    }
      
  }catch(error){
    console.log('error al hacer el login', error);
    res.status(500).send({
      codigo: 1,
      mensaje: "error a la hora de hacer el login",
      error: error.message,
      datoscliente:null,
      tokensesion:null,
      otrodatos:null
    });
  }
  

});
//#endregion



//#region endpoints de la api de tienda
serverExpress.get('/api/Tienda/RecuperarCategorias/:idcategoria', async (req, res)=>{
  //Si el parametro idcategoria es "padres", tengo que recuperar todas las categorias
  //Si el parametro es disinto, tengo que recuperar subcategorias

  try{
    let _idCategoria=req.params.idcategoria;
    let _patron;
    if(_idCategoria==='padres'){
      _patron=new RegExp('^\\d{1,}$');
    }else{
      _patron=new RegExp('^'+_idCategoria+'-.$');
    }
    let _cats = await Categoria.find({IdCategoria:{$regex:_patron}});
    res.status(200).send(_cats);
  }catch(error){
    console.log("Error al enviar categorías", error);
    res.status(500).send([]);
  }
});

serverExpress.get('/api/Tienda/RecuperarLibros/:idcategoria', async (req, res)=>{
  try{
    let _idCategoria=req.params.idcategoria;
    let _patron=new RegExp('^'+_idCategoria+'-.$');

    let _libros = await Libro.find({IdCategoria:{$regex:_patron}});
    res.status(200).send(_libros);
  }catch(error){
    console.log("Error al enviar libros", error);
    res.status(500).send([]);
  }
});
serverExpress.get('/api/Tienda/RecuperarLibro/:isbn13', async (req, res)=>{
  console.log('Datos recibidos por el cliente react en componente tienda, por ajax...', req.params);
  try{
    let _isbn13=req.params.isbn13;
    let _libro = await Libro.findOne({ISBN13:_isbn13});
    console.log('libro recuperado', _libro);
    res.status(200).send(_libro);
  }catch(error){
    console.log("Error al enviar libro", error);
    res.status(500).send(error);
  }
});
serverExpress.get('/api/Tienda/RecuperarComentarios/:isbn13', async (req, res)=>{
  try{
    let _isbn13=req.params.isbn13;
    let _comentarios = await Comentario.find({isbn13:_isbn13});
    console.log('comentarios recuperados', _comentarios);
    res.status(200).send(_comentarios);
  }catch(error){
    console.log("Error al enviar comentarios", error);
    res.status(500).send([]);
  }
});
serverExpress.post('/api/Tienda/EnviarComentario', async (req, res)=>{
  console.log('Datos recibidos por el cliente react en componente tienda, por ajax...', req.body);
  try{
    let _jwt=req.headers.authorization.split(' ')[1];
    let _datosToken=jsonwebtoken.verify(_jwt, process.env.JWT_SECRETKEY);
    if(_datosToken){
        let _comentario=req.body;
        let _resultInsert=await new Comentario({
          nombreUsuario: _comentario.nombreUsuario,
          isbn13: _comentario.isbn13,
          comentario: _comentario.comentario,
          valoracion: _comentario.valoracion,
        }).save();
        res.status(200).send(_resultInsert);
    }
  }catch(error){
    console.log("Error al enviar comentario", error);
    res.status(500).send([]);
  }

});
//#endregion
serverExpress.listen(5000, () =>
  console.log("servidor web express eschuchando por el puerto 5000")
);



//-----conexion al servidor mongodb
mongoose
  .connect(process.env.CONNECTION_MONGODB)
  .then(() =>
    console.log(
      "..conexion al servidor bg mongo establecido de forma correcta..."
    )
  )
  .catch((err) =>
    console.log("fallo el conectarnos al servidor de bd de mongo" + err)
  );



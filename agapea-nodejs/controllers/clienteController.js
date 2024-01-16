//modulo de nodejs donde exporto objeto js que tiene como props las funciones middleware
//que necesita el objeto router express de zona cliente
const bcrypt = require('bcrypt');
const Mailjet = require('node-mailjet');
const jsonwebtoken = require('jsonwebtoken');
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
);
let Categoria = require("../modelos/categoria");
let Libro = require("../modelos/libro");
let Cliente = require("../modelos/cliente");
let Direccion = require("../modelos/direccion");
let Pedido = require("../modelos/pedido");
let Comentario = require("../modelos/comentario");
let ListaDeseos = require("../modelos/listasDeseos");
module.exports = {
    login:async function(req,res,next){
        try{
            //1º comprobar que el cliente existe
            console.log("Datos recibidos por el cliente de React", req.body);
            const {email, password}=req.body;
            const _cliente = await Cliente.findOne({"cuenta.email":email})
                                          .populate(
                                            [
                                              {path:'direcciones', model:'Direccion'},
                                              {path:'pedidos', model:'Pedido', populate: {path:'elementosPedido.libroElemento', model:'Libro'}},
                                              {path:'comentarios', model:'Comentario', populate: {path:'idLibro', model:'Libro'}},
                                              {path:'listasDeseos', model:'ListaDeseos', populate: {path:'libros', model:'Libro'}},
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
    },
    registro:async function(req,res,next){
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
    },
    activarCuenta:async function(req,res,next){
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
    },
    subirFoto: async function(req,res,next){
      try{
            console.log("payload jwt recibido en el servidor", req.payload);
            console.log("imagen recibida en el servidor", req.body);
            let _idcliente= req.payload.idCliente;
            let _imagenAvatarBASE64=req.body.imagen;
            let _cliente = await Cliente.findByIdAndUpdate(_idcliente, { 'cuenta.imagenAvatarBASE64': _imagenAvatarBASE64 }, { new: true }).populate(
              [
                {path:'direcciones', model:'Direccion'},
                {path:'pedidos', model:'Pedido'},
                {path:'favoritos', model:'Libro'},
                {path:'comentarios', model:'Comentario'},
              ]
            );
            console.log('cliente actualizado...', _cliente);
            let _jwt=jsonwebtoken.sign(
                { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
                process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
                { expiresIn: '1h', issuer: 'http://localhost:3003' } //opciones o lista de cliams predefinidos
            );
            res.status(200).send(
                {
                    codigo: 0,
                    mensaje: 'imagen avatar actualizada...',
                    error: '',
                    datoscliente: _cliente,
                    jwt: _jwt,
                    otrosdatos: null
                }
            );
        
    }catch(error){
        console.log('error al subir foto...', error);
        res.status(500).send(
            {
                codigo: 1,
                mensaje: 'error al subir foto',
                error: error.message,
                datoscliente: null,
                tokensesion: null,
                otrosdatos: null
            }
        );
    
    }
    },
    ActualizarCliente:async function(req,res,next){
      try{
            console.log("payload jwt recibido en el servidor", req.payload);
            console.log("datos recibidos en el servidor", req.body);
            let _idcliente= req.payload.idCliente;
            let _datosCliente=req.body.datosCliente;
            //añadir encriptacion de password
            if(_datosCliente.cuenta.password){
              _datosCliente.cuenta.password=bcrypt.hashSync(_datosCliente.cuenta.password, 10);
            }
            //Añadir cuentaActiva=true
            _datosCliente.cuenta.cuentaActiva=true;
            let _cliente = await Cliente.findByIdAndUpdate(_idcliente, {$set: _datosCliente}, { new: true }).populate(
              [
                {path:'direcciones', model:'Direccion'},
                {path:'pedidos', model:'Pedido'},
                {path:'favoritos', model:'Libro'},
                {path:'comentarios', model:'Comentario'},
              ]);
            console.log('cliente actualizado...', _cliente);
            let _jwt=jsonwebtoken.sign(
                { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
                process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
                { expiresIn: '1h', issuer: 'http://localhost:5000' } //opciones o lista de cliams predefinidos
            );
            res.status(200).send(
                {
                    codigo: 0,
                    mensaje: 'cliente actualizado...',
                    error: '',
                    datoscliente: _cliente,
                    jwt: _jwt,
                    otrosdatos: null
                }
            );
        
    }catch(error){
        console.log('error al actualizar cliente...', error);
        res.status(500).send(
            {
                codigo: 1,
                mensaje: 'error al actualizar cliente',
                error: error.message,
                datoscliente: null,
                tokensesion: null,
                otrosdatos: null
            }
        );
          }
    },
    RecuperarDatosCliente:async function(req,res,next){
    try{
      console.log("payload en el jwt de un solo uso", req.payload);
      console.log("datos mandados en el body por el servicio de react restCliente", req.body);
      let {idcliente, idpedido, idpago}=req.payload;
      let _idcliente=req.body.idcliente;
      if(String(idcliente) !== String(_idcliente)){
        throw new Error('Alguien han manipulado los datos mandados en el body, no coinciden con lo almacenado en el jwt');
      }else{
        //actualizar el estado del pedido a en preparacion
        let _pedido=await Pedido.findByIdAndUpdate(idpedido, {estadoPedido:'en preparacion'}, {new:true});
        console.log('pedido actualizado...', _pedido);
        let _cliente = await Cliente.findById(idcliente).populate(
          [
            {path:'direcciones', model:'Direccion'},
            { path: 'pedidos', model: 'Pedido', populate: [ { path: 'elementosPedido.libroElemento', model: 'Libro' } ] },
          ]
        );
        console.log('cliente recuperado con el id...', _cliente);
        //token de sesion para datos del cliente actualizados
        let _jwt=jsonwebtoken.sign(
          { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
          process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
          { expiresIn: '1h', issuer: 'http://localhost:5000' } //opciones o lista de claimms predefinidos
        );
        res.status(200).send(
          {
            codigo: 0,
            mensaje: 'datos cliente recuperados de la bd',
            error: '',
            datoscliente: _cliente,
            jwt: _jwt,
            otrosdatos: null
          }
        )
      }
        }catch(error){
          console.log('error al recuperar cliente...', error);
          res.status(401).send(
              {
                  codigo: 1,
                  mensaje: 'error al obtener datos cliente y generar nuevo jwt de sesion tras pago con paypal',
                  error: error.message,
                  datoscliente: null,
                  tokensesion: null,
                  otrosdatos: null
              }
          );
        }
      },
    AgregarDireccion:async function(req,res,next){
      try{
          console.log("payload del jwt", req.payload);
          console.log("datos mandados en el body por el servicio de react restCliente", req.body);
          //Agregar nueva direccion a coleccion direcciones
          let _resultInsert = await new Direccion(req.body.direccion).save();
          //Si todo ok, recuperar el _id de nueva direccion y añadirlo al array de direcciones del cliente
          let _idcliente=req.payload.idcliente;
          let _cliente=await Cliente.findByIdAndUpdate(_idcliente, {$push:{direcciones:_resultInsert._id}}, {new:true}).populate(
            [
              {path:'direcciones', model:'Direccion'},
              {path:'pedidos', model:'Pedido'},
              {path:'favoritos', model:'Libro'},
              {path:'comentarios', model:'Comentario'},
            ]
          );
          console.log('cliente actualizado...', _cliente);
          //token de sesion para datos del cliente actualizados
          let _jwt=jsonwebtoken.sign(
            { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
            process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
            { expiresIn: '1h', issuer: 'http://localhost:5000' } //opciones o lista de claimms predefinidos
          );
          res.status(200).send(
            {
              codigo: 0,
              mensaje: 'direccion agregada a cliente',
              error: '',
              datoscliente: _cliente,
              jwt: _jwt,
              otrosdatos: null
            }
          );
        }catch(error){
          console.log('error al agregar direccion...', error);
          res.status(401).send(
              {
                  codigo: 1,
                  mensaje: 'error al agregar direccion',
                  error: error.message,
                  datoscliente: null,
                  tokensesion: null,
                  otrosdatos: null
              }
          );
        }

      },
    ModificarDireccion:async function(req,res,next){
      try {
        console.log("payload del jwt", req.payload);
        console.log("datos mandados en el body por el servicio de react restCliente", req.body.direccion);
        let _idDir = req.body.direccion._id;
        let _idcliente = req.payload.idcliente;
        let _respUpdate = await Direccion.findByIdAndUpdate(_idDir, { $set: req.body.direccion }, { new: true });
        let _cliente = await Cliente.findById(_idcliente).populate(
          [
            {path:'direcciones', model:'Direccion'},
            {path:'pedidos', model:'Pedido'},
            {path:'favoritos', model:'Libro'},
            {path:'comentarios', model:'Comentario'},
          ]
        );
        console.log('cliente actualizado...', _cliente);
        //token de sesion para datos del cliente actualizados
        let _jwt=jsonwebtoken.sign(
          { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
          process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
          { expiresIn: '1h', issuer: 'http://localhost:5000' } //opciones o lista de claimms predefinidos
        );
        res.status(200).send(
          {
            codigo: 0,
            mensaje: 'direccion modificada',
            error: '',
            datoscliente: _cliente,
            jwt: _jwt,
            otrosdatos: null
          }
        );

      } catch (error) {
        console.log('error al modificar direccion...', error);
        res.status(401).send(
          {
            codigo: 1,
            mensaje: 'error al modificar direccion',
            error: error.message,
            datoscliente: null,
            tokensesion: null,
            otrosdatos: null
          }
        );
      }
      },
    EliminarDireccion:async function(req,res,next){
      try {
        console.log("payload del jwt", req.payload);
        console.log("datos mandados en el body por el servicio de react restCliente", req.body);
        let _idDir = req.body.idDireccion;
        let _idcliente = req.payload.idCliente;
        let _respDelete = await Direccion.findByIdAndDelete(_idDir);
        //Eliminar la direccion del array de direcciones del cliente
        let _cliente = await Cliente.findByIdAndUpdate(_idcliente, { $pull: { direcciones: _idDir } }, { new: true }).populate(
          [
            {path:'direcciones', model:'Direccion'},
            {path:'pedidos', model:'Pedido'},
            {path:'favoritos', model:'Libro'},
            {path:'comentarios', model:'Comentario'},
          ]
        );
        
        console.log('cliente actualizado...', _cliente);
        //token de sesion para datos del cliente actualizados
        let _jwt=jsonwebtoken.sign(
          { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
          process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
          { expiresIn: '1h', issuer: 'http://localhost:5000' } //opciones o lista de claimms predefinidos
        );
        res.status(200).send(
          {
            codigo: 0,
            mensaje: 'direccion eliminada',
            error: '',
            datoscliente: _cliente,
            jwt: _jwt,
            otrosdatos: null
          }
        );

      } catch (error) {
        console.log('error al eliminar direccion...', error);
        res.status(401).send(
          {
            codigo: 1,
            mensaje: 'error al eliminar direccion',
            error: error.message,
            datoscliente: null,
            tokensesion: null,
            otrosdatos: null
          }
        );
      }
      },
    HacerDirPrincipal:async function(req,res,next){
      try{
        console.log("payload del jwt", req.payload);
        console.log("datos mandados en el body por el servicio de react restCliente", req.body);
        let _dirModificada = await Direccion.findByIdAndUpdate(req.body.idDireccion, { esPrincipal: true }, { new: true }); 
        console.log('direccion modificada...', _dirModificada);
        let _cliente = await Cliente.findById(req.payload.idCliente).populate(
          [
            {path:'direcciones', model:'Direccion'},
            {path:'pedidos', model:'Pedido'},
            {path:'favoritos', model:'Libro'},
            {path:'comentarios', model:'Comentario'},
          ]
        );
        let _jwt=jsonwebtoken.sign(
          { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idCliente: _cliente._id }, //<--- payload jwt
          process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
          { expiresIn: '1h', issuer: 'http://localhost:5000' } //opciones o lista de cliams predefinidos
      );
        res.status(200).send(
          {
            codigo: 0,
            mensaje: 'direccion modificada',
            error: '',
            datoscliente: _cliente,
            jwt: _jwt,
            otrosdatos: null
          }
        );
      }catch(error){
        console.log('error al hacer principal...', error);
        res.status(401).send(
          {
            codigo: 1,
            mensaje: 'error al hacer principal',
            error: error.message,
            datoscliente: null,
            tokensesion: null,
            otrosdatos: null
          }
        );
      }



    },
    EliminarPrincipal:async function(req,res,next){
      try{
        console.log("payload del jwt", req.payload);
        console.log("datos mandados en el body por el servicio de react restCliente", req.body);
        let _dirModificada= await Direccion.findByIdAndUpdate(req.body.idDireccion, {esPrincipal:false}, {new:true});
        console.log('direccion modificada...', _dirModificada);
        res.status(200).send(
          {
            codigo: 0,
            mensaje: 'direccion modificada',
            error: '',
            datoscliente: null,
            tokensesion: null,
            otrosdatos: null
          }
        );
      }catch(error){
        console.log('error al eliminar principal...', error);
        res.status(401).send(
          {
            codigo: 1,
            mensaje: 'error al eliminar principal',
            error: error.message,
            datoscliente: null,
            tokensesion: null,
            otrosdatos: null
          }
        );
      }


    },
    CrearListaDeseos:async function(req,res,next){
      try{
        console.log("payload del jwt", req.payload);
        console.log("datos mandados en el body por el servicio de react restCliente", req.body);
        let _idcliente=req.payload.idCliente;
        let _nombreLista=req.body.nombreLista;
        let _resultInsert=await new ListaDeseos({nombreLista:_nombreLista}).save();
        console.log('lista de deseos insertada...', _resultInsert);
        let _cliente=await Cliente.findByIdAndUpdate(_idcliente, {$push:{listasDeseos:_resultInsert._id}}, {new:true}).populate(
          [
            {path:'direcciones', model:'Direccion'},
            {path:'pedidos', model:'Pedido'},
            {path:'comentarios', model:'Comentario', populate: {path:'idLibro', model:'Libro'}},
            {path:'listasDeseos', model:'ListaDeseos', populate: {path:'libros', model:'Libro'}},
          ]
        );
        console.log('cliente actualizado...', _cliente);
        let _jwt=jsonwebtoken.sign(
          { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
          process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
          { expiresIn: '1h', issuer: 'http://localhost:5000' } //opciones o lista de claimms predefinidos
        );
        res.status(200).send(
          {
            codigo: 0,
            mensaje: 'lista de deseos creada',
            error: '',
            datoscliente: _cliente,
            jwt: _jwt,
            otrosdatos: null
          }
        );
      }catch(error){
        console.log('error al crear lista de deseos...', error);
        res.status(401).send(
          {
            codigo: 1,
            mensaje: 'error al crear lista de deseos',
            error: error.message,
            datoscliente: null,
            tokensesion: null,
            otrosdatos: null
          }
        );
      }
    },
    AgregarLibroListaDeseos:async function(req,res,next){
      try{
        console.log("payload del jwt", req.payload);
        console.log("datos mandados en el body por el servicio de react restCliente", req.body);
        let _idcliente=req.payload.idCliente;
        let _idlista=req.body.idListaDeseos;
        let _idlibro=req.body.idLibro;
          let _resultUpdate=await ListaDeseos.findByIdAndUpdate(_idlista, {$push:{libros:_idlibro}}, {new:true});
          console.log('lista de deseos actualizada...', _resultUpdate);
          let _cliente=await Cliente.findById(_idcliente).populate(
            [
              {path:'direcciones', model:'Direccion'},
              {path:'pedidos', model:'Pedido'},
              {path:'comentarios', model:'Comentario', populate: {path:'idLibro', model:'Libro'}},
              {path:'listasDeseos', model:'ListaDeseos', populate: {path:'libros', model:'Libro'}},
            ]
          );
          console.log('cliente actualizado...', _cliente);
          let _jwt=jsonwebtoken.sign(
            { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
            process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
            { expiresIn: '1h', issuer: 'http://localhost:5000' } //opciones o lista de claimms predefinidos
          );
          res.status(200).send(
            {
              codigo: 0,
              mensaje: 'lista de deseos actualizada',
              error: '',
              datoscliente: _cliente,
              jwt: _jwt,
              otrosdatos: null
            }
          );
        
      }catch(error){
        console.log('error al agregar libro a lista de deseos...', error);
        res.status(401).send(
          {
            codigo: 1,
            mensaje: 'error al agregar libro a lista de deseos',
            error: error.message,
            datoscliente: null,
            tokensesion: null,
            otrosdatos: null
          }
        );
      }
    },
    EliminarLibroListaDeseos:async function(req,res,next){
      try{
        console.log("payload del jwt", req.payload);
        console.log("datos mandados en el body por el servicio de react restCliente", req.body);
        let _idcliente=req.payload.idcliente;
        let _idlista=req.body.idListaDeseos;
        let _idlibro=req.body.idLibro;
        let _resultUpdate=await ListaDeseos.findByIdAndUpdate(_idlista, {$pull:{libros:_idlibro}}, {new:true});
        console.log('lista de deseos actualizada...', _resultUpdate);
        let _cliente=await Cliente.findById(_idcliente).populate(
          [
            {path:'direcciones', model:'Direccion'},
            {path:'pedidos', model:'Pedido'},
            {path:'comentarios', model:'Comentario', populate: {path:'idLibro', model:'Libro'}},
            {path:'listasDeseos', model:'ListaDeseos', populate: {path:'libros', model:'Libro'}},
          ]
        );
        console.log('cliente actualizado...', _cliente);
        let _jwt=jsonwebtoken.sign(
          { nombre: _cliente.nombre, apellidos: _cliente.apellidos, email: _cliente.cuenta.email, idcliente: _cliente._id }, //<--- payload jwt
          process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
          { expiresIn: '1h', issuer: 'http://localhost:5000' } //opciones o lista de claimms predefinidos
        );
        res.status(200).send(
          {
            codigo: 0,
            mensaje: 'lista de deseos actualizada',
            error: '',
            datoscliente: _cliente,
            jwt: _jwt,
            otrosdatos: null
          }
        );
      }catch(error){
        console.log('error al eliminar libro de lista de deseos...', error);
        res.status(401).send(
          {
            codigo: 1,
            mensaje: 'error al eliminar libro de lista de deseos',
            error: error.message,
            datoscliente: null,
            tokensesion: null,
            otrosdatos: null
          }
        );
      }
    },
    };
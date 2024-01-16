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
let Direcciones = require("../modelos/direccion");
let Pedido = require("../modelos/pedido");
let Comentario = require("../modelos/comentario");
module.exports = {
    recuperarCategorias:async function(req,res,next){
      try {
        //si en parametro idcategoria va 'padres' tengo q recuperar categorias raices...
        //si va otro valor, p.e: 2-10 tendria q recuperar subcategorias hijas....
        var _idcategoria=req.params.idCategoria;
        //console.log('categoria mandada desde react...', _idcategoria);

        var _patron=_idcategoria==='padres' ?  new RegExp("^\\d{1,}$") : new RegExp("^" + _idcategoria + "-\\d{1,}$");
        var _cats=await Categoria.find( { IdCategoria: { $regex: _patron }  } );

       //console.log('categorias recuperadas...', _cats);

        res.status(200).send(_cats);

        
} catch (error) {
    console.log('error al recuperar categorias...',error);
    res.status(200).send( [] );
} 
    },
    recuperarLibros:async function(req,res,next){
        try{
            let _idCategoria=req.params.idcategoria;
            let _patron=new RegExp('^'+_idCategoria+'-.$');
        
            let _libros = await Libro.find({IdCategoria:{$regex:_patron}});
            res.status(200).send(_libros);
          }catch(error){
            console.log("Error al enviar libros", error);
            res.status(500).send([]);
        }
    },
    recuperarLibro:async function(req,res,next){
        try{
          let _isbn13=req.params.isbn13;
          let _libro = await Libro.findOne({ISBN13:_isbn13});
          res.status(200).send(_libro);
        }catch(error){
          console.log("Error al enviar libro", error);
          res.status(500).send(error);
        }
    },
    recuperarComentarios:async function(req,res,next){
        try{
          console.log(req.params);
            let _idlibro=req.params.idlibro;
            console.log('id libro recibido...', _idlibro);
            let _comentarios = await Comentario.find({idLibro:_idlibro});
            console.log('comentarios recuperados', _comentarios);
            res.status(200).send(_comentarios);
          }catch(error){
            console.log("Error al enviar comentarios", error);
            res.status(500).send([]);
          }
    },
    enviarComentario:async function(req,res,next){
        console.log('Datos recibidos por el cliente react en componente tienda, por ajax...', req.body);
        try{
          console.log('Datos recibidos por el cliente react en componente tienda, por ajax...', req.body);
          console.log('token recibido', req.headers.authorization.split(' ')[1]);
          let _token=req.headers.authorization.split(' ')[1];
          let _datosComentario=req.body;
          let _datosToken=jsonwebtoken.verify(_token, process.env.JWT_SECRETKEY);
          console.log('datos token', _datosToken);
          if(_datosToken){
            let _comentario=new Comentario({
              idLibro:_datosComentario.idLibro,
              nombreUsuario:_datosComentario.nombreUsuario,
              valoracion:_datosComentario.valoracion,
              comentario:_datosComentario.comentario
            });
            await _comentario.save();
            //Si todo ok, recuperammos cliente con el nombre del usuario y le agregamos el id del comentario a su array de comentarios
            let _cliente=await Cliente.findById(_datosToken.idCliente);
            _cliente.comentarios.push(_comentario._id);
            await _cliente.save();
            //generamos un nuevo token con los datos actualizados del cliente
            let _jwt= jsonwebtoken.sign({nombre:_cliente.nombre, apellidos:_cliente.apellidos, email:_cliente.cuenta.email, idCliente:_cliente._id}, 
              process.env.JWT_SECRETKEY, {expiresIn: '1h', issuer: 'http://localhost:5000'});
              res.status(200).send({
                codigo: 0,
                mensaje: "comentario añadido correctamente",
                error: null,
                datoscliente: _cliente,
                tokensesion:_jwt,
                otrodatos: _comentario._id
              });

          }
        }catch(error){
          console.log("Error al enviar comentario", error);
          res.status(500).send([]);
        }
    },
    editarComentario: async function (req, res, next) {
        console.log('Datos recibidos por el cliente react en componente tienda, por ajax...', req.body);
        try {
          console.log('Datos recibidos por el cliente react en componente tienda, por ajax...', req.body);
          console.log('token recibido', req.headers.authorization.split(' ')[1]);
          let _token = req.headers.authorization.split(' ')[1];
          let _datosComentario = req.body;
          let _datosToken = jsonwebtoken.verify(_token, process.env.JWT_SECRETKEY);
          console.log('datos token', _datosToken);
          if (_datosToken) {
            let _comentario = await Comentario.findById(_datosComentario.idComentario);
            _comentario.comentario = _datosComentario.comentario;
            await _comentario.save();
            //Si todo ok, recuperammos cliente con el nombre del usuario y le agregamos el id del comentario a su array de comentarios
            let _cliente = await Cliente.findById(_datosToken.idCliente);
            //generamos un nuevo token con los datos actualizados del cliente
            let _jwt = jsonwebtoken.sign({
              nombre: _cliente.nombre,
              apellidos: _cliente.apellidos,
              email: _cliente.cuenta.email,
              idCliente: _cliente._id
            },
              process.env.JWT_SECRETKEY, {
              expiresIn: '1h',
              issuer: 'http://localhost:5000'
            });
            res.status(200).send({
              codigo: 0,
              mensaje: "comentario editado correctamente",
              error: null,
              datoscliente: _cliente,
              tokensesion: _jwt,
              otrodatos: _comentario._id
            });
          }
        } catch (error) {
          console.log("Error al enviar comentario", error);
          res.status(500).send([]);
        }
      },
};
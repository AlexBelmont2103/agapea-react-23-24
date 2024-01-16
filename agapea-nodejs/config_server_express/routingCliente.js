//modulo de codigo para definir endpoints de la zona cliente con sus respectivas funciones middleware para su procesamiento
//se meten en objeto router y este se exporta
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router(); //objeto router de express para definir endpoints de la zona cliente
//----- funcion middleware check JWT mandado por el cliente react ------------
async function checkJWT(req,res,next){
    try{
        let _jwt=req.headers.authorization.split(' ')[1];
        console.log('jwt recibido en el servidor',_jwt);
        const _payload= jwt.verify(_jwt,process.env.JWT_SECRETKEY);
        req.payload=_payload;
        next();
    }catch(error){
        console.log('Error al intentar validar JWT...',error);
        res.status(401).send(
            {codigo:1,
                mensaje:'Error al intentar validar JWT...', 
                error:error.message,
                otrosdatos:null,
                datoscliente:null,
                jwt: null
            });
    }
};
//añado endpoints de la zona cliente y funciones middleware importadas desde un objeto js que funciona como si fuese un "controlador"
// a ese objeto router
const clienteController = require("../controllers/clienteController");
router.post("/Registro", clienteController.registro); //endpoint de la zona cliente para registrar un nuevo cliente
router.post("/Login", clienteController.login); //endpoint de la zona cliente para logarse un cliente
router.get("/ActivarCuenta/:id", clienteController.activarCuenta); //endpoint de la zona cliente para activar la cuenta de un cliente
router.post("/SubirFoto", checkJWT, clienteController.subirFoto); //endpoint de la zona cliente para subir una foto de perfil
router.post("/ActualizarCliente", checkJWT, clienteController.ActualizarCliente); //endpoint de la zona cliente para actualizar datos de un cliente
router.post('/RecuperarDatosCliente', checkJWT, clienteController.RecuperarDatosCliente); //endpoint de la zona cliente para recuperar datos de un cliente
router.post('/AgregarDireccion',checkJWT, clienteController.AgregarDireccion); //endpoint de la zona cliente para agregar una direccion a un cliente
router.post('/ModificarDireccion',checkJWT, clienteController.ModificarDireccion); //endpoint de la zona cliente para modificar una direccion de un cliente
router.post('/EliminarDireccion',checkJWT, clienteController.EliminarDireccion); //endpoint de la zona cliente para eliminar una direccion de un cliente
router.post('/HacerDirPrincipal',checkJWT, clienteController.HacerDirPrincipal); //endpoint de la zona cliente para hacer principal una direccion de un cliente')
router.post('/EliminarPrincipal',checkJWT, clienteController.EliminarPrincipal); //endpoint de la zona cliente para eliminar principal una direccion de un cliente')
router.post('/CrearListaDeseos',checkJWT, clienteController.CrearListaDeseos); //endpoint de la zona cliente para crear una lista de deseos
router.post('/AgregarLibroListaDeseos',checkJWT, clienteController.AgregarLibroListaDeseos); //endpoint de la zona cliente para agregar un libro a una lista de deseos
router.post('/EliminarLibroListaDeseos',checkJWT, clienteController.EliminarLibroListaDeseos); //endpoint de la zona cliente para eliminar un libro de una lista de deseos


module.exports = router; //exporto objeto router con endpoints de la zona cliente y sus funciones middleware
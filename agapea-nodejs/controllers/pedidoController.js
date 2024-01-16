const stripeservice=require('../servicios/servicioStripe');
const jsonwebtoken=require('jsonwebtoken');
const mongoose=require('mongoose');

let Cliente=require('../modelos/cliente');
let Categoria=require('../modelos/categoria');
let Direccion=require('../modelos/direccion');
let Pedido=require('../modelos/pedido');
let Libro=require('../modelos/libro');
let PagosPayPal=require('../modelos/pagospaypal');
const servicioPaypal = require('../servicios/servicioPaypal');

module.exports={
    finalizarPedido: async (req,res,next)=>{
        try {
            //en req.payload esta metido el payload del JWT mandadao en la cabecera del request: { nombre,apellidos, email, idcliente}
            console.log('payload del jwt...', req.payload);

            //en req.body van los datos de la pet.ajax del request: { datosEntrega, datosFactura, datosPago, elementosPedido, gastosEnvio, clienteLogged}
            console.log('body de la peticion...', req.body);
            let { datosEntrega, datosFactura, datosPago, elementosPedido, gastosEnvio, clienteLogged }=req.body;

            //#region 1º paso) ----nos creamos nuevas direcciones de envio/facturacion si mandan datos en datosEnvio y datosFacutaracion ---
            //#endregion

            //#region 2º paso) ----nos creamos objeto Pedido a partir de elementosPedido, gastosEnvio y metemos en mongo y actualizamos cliente ---
            let _idnuevoPedido=new mongoose.Types.ObjectId();
            let _subtotalPedido=elementosPedido.reduce((acum,elem)=> acum + (elem.libroElemento.Precio * elem.cantidadElemento), 0).toFixed(2);
            let _totalPedido=parseFloat(_subtotalPedido) + parseFloat(gastosEnvio);
            console.log('subtotal pedido...', _subtotalPedido);
            console.log('total pedido...', _totalPedido);


            let _newPedido={
                _id: _idnuevoPedido,
                fechaPedido: new Date(Date.now()),
                elementosPedido, //<---- aqui van los elementos expandidos: en libroElemento solo debe ir el _id
                subTotalPedido: _subtotalPedido,
                gastosEnvio,
                totalPedido: _totalPedido,
                direccionEnvio: clienteLogged.datoscliente.direcciones.filter(dir=>dir.esPrincipal===true)[0]._id,
                direccionFacturacion: clienteLogged.datoscliente.direcciones.filter(dir=>dir.esFacturacion==='true')[0]._id
            };

            let _resultadoINSERT=await new Pedido(_newPedido).save()
            console.log('resultado insert nuevo pedido...', _resultadoINSERT);

            //update cliente....
            let _resultadoUPDATECli=await Cliente.updateOne({_id: clienteLogged.datoscliente._id}, {$push: { 'pedidos': _idnuevoPedido}} );
            console.log('resultado update Cliente con nuevo pedido...', _resultadoUPDATECli);


            //#endregion

            //#region 3º paso) ----pago con stripe o con paypal ---
            if (datosPago.pagoradios==='pagotarjeta') {
                //#region /////////// pago con STRIPE ////////////////
                let _customerStripeId=await stripeservice.createCustomer(clienteLogged.datoscliente);
                if (! _customerStripeId) throw new Error('error pago STRIPE al intentar crear objeto CUSTOMER');

                let _cardId=await stripeservice.createCardFromCustomer(_customerStripeId);
                if(! _cardId) throw new Error('error pago STRIPE al intentar crear objeto CARD asociado al Customer');

                if (await stripeservice.createCharge(_customerStripeId, _cardId, _totalPedido, _idnuevoPedido)) {
                    //si todo ok, actualizamos el estado del pedido a "en preparacion"
                    let _pedidoUpdated = await Pedido.findByIdAndUpdate(_idnuevoPedido, {"estadoPedido": "en preparacion"}, {new: true});
                    let _jwt=jsonwebtoken.sign(
                        { nombre: clienteLogged.datoscliente.nombre, apellidos: clienteLogged.datoscliente.apellidos, email: clienteLogged.datoscliente.cuenta.email, idcliente: clienteLogged.datoscliente._id }, //<--- payload jwt
                        process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
                        { expiresIn: '1h', issuer: 'http://localhost:5000/' } //opciones o lista de cliams predefinidos
                    );
    

                    res.status(200)
                        .send(
                              {
                                codigo: 0,
                                mensaje:'pedido finalizado y pagado con STRIPE de forma correcta',
                                error: null,
                                datoscliente: clienteLogged.datoscliente,//meter el cliente con su prop.pedidos actualizada con el nuevo pedido
                                tokensesion: _jwt,
                                otrosdatos:null
                              }  
                    );
                } else {
                    
                }
                //#endregion
            } else {
                //#region /////////// pago con PAYPAL ////////////////
                let _resp = await servicioPaypal.crearPagoPAYPAL(clienteLogged.datoscliente._id, _newPedido);
                console.log("Respuesta: ",_resp);
                if(!_resp) throw new Error('error pago PAYPAL al intentar crear objeto PAGO');
                res.status(200).send(
                    {
                        codigo: 0,
                        mensaje:'pedido finalizado y pagado con PAYPAL de forma correcta',
                        error: null,
                        datoscliente: null,
                        tokensesion: null,
                        otrosdatos: JSON.stringify({urlPayPal: _resp})
                    }  
                );
                
            }
            //#endregion            
        } catch (error) {
            console.log('error al finalizar pedido...', error);
            res.status(403).send(
                {
                    codigo: 1,
                    mensaje: 'error al finalizar pedido en servicio de nodejs contra mongodb',
                    error: error.message,
                    datoscliente: null,
                    tokensesion:null,
                    otrosdatos:null
                }
            )
        }
    },
    paypalCallback: async (req,res,next)=>{//OJO este servicio es invocado por paypal cuando el cliente ha finalizado el pago
        //En la url viene parametros: 
        //idcli <--- idcliente que ha hecho el pedido
        //pedido <--- idpedido que ha hecho el pedido
        //cancel <--- true o false
        console.log('Parametros recibidos...', req.query);
        let {idcliente,idpedido,cancel}=req.query;
        //necesito obtener el id-pago generado por paypal para el pedido
        let _pagoPayPal=await PagosPayPal.findOne({idcliente: idcliente, idpedido: idpedido});
        let _finPagoOk= await servicioPaypal.finalizarPagoPAYPAL(_pagoPayPal.idpago);
        if(! _finPagoOk || cancel==true) throw new Error('Error al finalizar pago con PAYPAL');
        //Genero un jwt de un solo uso para mandar al cliente y garantizar que es el cliente de react quien usa el componente finalizar pedido
        let _jwtSoloUnUso=jsonwebtoken.sign(
            { idcliente: idcliente, idpedido: idpedido, idpago: _pagoPayPal.idpago },
            process.env.JWT_SECRETKEY,
            { expiresIn: '5m', issuer: 'http://localhost:5000/' }
        );
        res.status(200).redirect(`http://localhost:3000/Pedido/FinalizarPedidoOk?idcliente=${idcliente}&idpedido=${idpedido}&token=${_jwtSoloUnUso}`);
    },
}
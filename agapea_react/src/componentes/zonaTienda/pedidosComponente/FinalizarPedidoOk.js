import {useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; 
 
import { useClienteLoggedContext } from '../../../contextProviders/clienteLoggedContext'
import {RecuperarDatosCliente} from '../../../servicios/restCliente'

function FinalizarPedidoOk( {props} ) {
       //parametros recibidos en la url desde servicio nodejs si pago con paypal...
       let [ searchParams, setSearchParams ]=useSearchParams(); //en searchParams te devuelve un objeto URLSearchParams
       
       let _idcliente=searchParams.get('idcliente');
       let _idpedido=searchParams.get('idpedido');
       let _jwtUnUso=searchParams.get('token');
       
        //#region --------------- state manejado por el componente (global por context-api o local) ------------------
        let { clienteLogged, dispatch }=useClienteLoggedContext();

        let [ datosClienteLogged, setDatosClienteLogged]=useState(null);
        let [ pedidoFinalizado, setPedidoFinalizado]=useState(null);
        //#endregion

        //#region --------------- efectos del componente -------------------------------------------------------------
        //recuperar de nuevo los datos del cliente (en pago por paypal pq el contexto global ha desaparecido....)
        useEffect(
            () => {
                async function ObtenerDatosCliente(){
                    let _respServer=await RecuperarDatosCliente(_idcliente, _jwtUnUso);
                    let _datosCliente=_respServer.codigo===0? _respServer.datoscliente : null;
                    console.log("Respuesta del server...",_respServer);
                    
                    
                    if(_datosCliente){
                        //hacer dispatch para el reducer para volver a crear contexto global con datos del cliente actualizados...
                        let _payload={datoscliente: _datosCliente, jwt: _respServer.jwt};
                        console.log("Payload para actualizar contexto global...",_payload);
                        setDatosClienteLogged(_datosCliente);
                        setPedidoFinalizado(_datosCliente.pedidos.filter(ped=>ped._id===_idpedido)[0]);
                        dispatch({type:'CLIENTE_RECUPERAR', payload: _payload});
                        console.log("Datos cliente en contexto global actualizados...",clienteLogged);
                    }
                }
                ObtenerDatosCliente();
                }, []);
        
        //#endregion

        //#region --------------- funciones manejadoras de eventos ----------------------------------------------------
        //#endregion


        return (
            <div className="container">
            {
                datosClienteLogged ? 
                <>

                    <div className="row">
                        <img src="/images/pedidoOK.jpg" style={{width: "200px", height: "200px"}} alt="..."/>
                    </div>

                    <div className="row">
                        <div className="col">
                            <p><h5>Pago del pedido con id: {pedidoFinalizado._id} realizado correctamente</h5></p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <p>Has pagado {pedidoFinalizado.totalPedido}€ en fecha: {pedidoFinalizado.fechaPedido} en Agapea.com</p>
                            <p>Se te ha mandado un email a <span style={{color:'cyan'}}>{
                                        datosClienteLogged.cuenta.email
                            }</span> con la factura del mismo (consulta la bandeja de entrada de tu correo o el spam por si acaso).</p>
                            <br />
                            <p> Accede al panel de tu USUARIO para ver la lista de pedidos que has hecho en la tienda.</p>
                        </div>
                    </div>
                    
                    <div className="row d-flex justify-content-center">
                        <Link className="btn btn-success btn-lg" to="/Cliente/Panel/InicioPanel">IR A MI PANEL</Link>
                    </div>


                
                </>

                :

                <>
                    {/* ....spinner mientras recupero datos cliente.... */}
                    <div className="d-flex align-items-center">
                        <strong>Espera un momento...</strong>
                        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>                    
                </>
            }
            </div> 
               
        );
}

export default FinalizarPedidoOk;
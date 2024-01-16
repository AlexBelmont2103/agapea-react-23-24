import {useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useItemsCarroContext } from '../../../contextProviders/itemsCarroContext';
import { useClienteLoggedContext } from '../../../contextProviders/clienteLoggedContext';

import pedidoRESTService from '../../../servicios/restPedido';
import ElementoPedido from './ElementoPedido';
import DatosFactura from './DatosFactura';
import DatosEntrega from './DatosEntrega';
import DatosPago from './DatosPago';
 
function MostrarPedido( {props} ) {
        //#region --------------- state manejado por el componente (global por context-api o local) ------------------
        //-------recuperacion del global-state items del pedido------
            let { itemsCarro, dispatch }=useItemsCarroContext();
            let { clienteLogged }=useClienteLoggedContext();
            const navigate = useNavigate();

            //------ state-local del componente pedido: variables Subtotal, Gastos de Envio y Total
            // este state-local debe recalcularse cada vez q cambia: itemsPedido <--- necesito efecto

            let [ datosEntrega, setDatosEntrega]=useState(
                {
                    calle:'',
                    municipio:'',
                    provincia:'',
                    pais:'',
                    cp:'',
                    nombreEnvio:'',
                    apellidosEnvio:'',
                    telefonoContacto:'',
                    emailEnvio:'',
                    otrosDatos:''
                 }         
            );

            let [ deseoFactura, setDeseoFactura]=useState(false);
            let [ datosFactura, setDatosFactura]=useState(
                {
                    tipofactura:'facturaempresa', //puede ser: facturaempresa o facturaparticular
                    nombreFactura:'',
                    docFactura:'',
                    checkdireccionfactura:'true',
                    callefactura:'',
                    municipiofactura:'',
                    provinciafactura:'',
                    paisfactura:'',
                    cpfactura:''       
                }
            );

            let [ datosPago, setDatosPago]=useState(
                {
                    pagoradios: 'pagotarjeta',
                    numerocard: '4242424242424242',
                    mescard: '',
                    aniocard: '',
                    cvv:'',
                    nombrebancocard: ''
                }
            );

            let [subTotalPedido,setSubTotalPedido]=useState(0);
            let [gastosEnvio,setGastosEnvio]=useState(2); //<----- deberia establecer los gastos de envio en funcion PROV. direccion principal cliente logueado
            //#endregion

            //#region --------------- efectos del componente -------------------------------------------------------------
            useEffect(
                ()=>{
                    console.log('efecto de cambio en itemsCarro', itemsCarro);
                    let _subtotal=itemsCarro.reduce( (acum, el)=> acum + (parseFloat(el.libroElemento.Precio) * el.cantidadElemento), 0 );
                    setSubTotalPedido(_subtotal.toFixed(2));
                },
                [itemsCarro]
            );


            useEffect(
                () => {
                    const _dirppal=clienteLogged.datoscliente.direcciones.filter( dir=>dir.esPrincipal===true)[0];

                    switch (_dirppal.provincia.CPRO) {
                        case '07'://Baleares
                            setGastosEnvio(2.5);
                            break;

                        case "38":
                        case "35"://Canarias
                            setGastosEnvio(3);
                            break;

                        case "51":
                        case "52"://Ceuta y Melilla
                            setGastosEnvio(3.5);
                            break;

                        default: //peninsula
                            setGastosEnvio(2);
                            break;
                    }
              }, 
              [clienteLogged.datoscliente.direcciones]);

            //#endregion

            //#region --------------- funciones manejadoras de eventos ----------------------------------------------------
            async function HandlerSubmitCompra(ev){
                //....envio de datos del pedido a nodejs ......
                ev.preventDefault();
                console.log('datos del pedido a enviar a nodejs',
                 datosEntrega, datosFactura, datosPago, itemsCarro, subTotalPedido, gastosEnvio, clienteLogged);
                let _respuesta= await pedidoRESTService.finalizarPedido(datosEntrega, datosFactura, datosPago, itemsCarro, gastosEnvio, clienteLogged);
                console.log("Respuesta del server al intentar finalizar pedido: ", _respuesta);
                if(_respuesta.codigo===0){
                    //si todo ok, borrar el pedido de clienteLogged y navegar a la pagina de inicio
                    if(datosPago.pagoradios==='pagotarjeta'){
                        dispatch({type:'VACIAR_CARRITO'});
                        navigate('/Cliente/Panel/InicioPanel');
                    }else{
                        console.log('Redirecciono a pasarela de pago paypal....', _respuesta.otrosdatos);
                        try {
                            const otrosDatos = JSON.parse(_respuesta.otrosdatos);
                            window.location.href = otrosDatos.urlPayPal;
                        } catch (error) {
                            console.error('Error al parsear otrosDatos:', error);
                        }
                    }
                }else{
                    console.log('error al intentar finalizar pedido', _respuesta);
                }
            }        
            //#endregion


            //-----------------------------------------------------------------------------------------------------
            //----------------------vista del componente ----------------------------------------------------------
            //-----------------------------------------------------------------------------------------------------
            return(
                <div className='container'>
                    <div className='row'>
                        {/* ------ columna para direccion envio, facturacion y metodo de pago ----*/}
                        <div className='col-8'>
                            <form onSubmit={HandlerSubmitCompra}>             
                                <div className='container'>
                                    
                                    <DatosEntrega datosEntrega={datosEntrega} setDatosEntrega={setDatosEntrega}/>
                                    
                                    <div className="row">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="deseoFactura" id="deseoFactura" onChange={ (ev)=>setDeseoFactura(ev.target.checked) }/>
                                                <label className="form-check-label" htmlFor="deseoFactura">
                                                    Deseo Factura
                                                </label>
                                            </div>                        
                                    </div>
                                    {
                                        deseoFactura && (
                                            <div className="row mt-3">
                                                <DatosFactura datosFactura={datosFactura} setDatosFactura={setDatosFactura} />
                                            </div>
                                        )
                                    }
                                    <div className="row mt-3">
                                        <DatosPago datosPago={datosPago} setDatosPago={setDatosPago}/>
                                    </div>

                                    {/*-- checkbox de aceptar condiciones de devolucion y politica de uso y boton finalizar compra-->*/}
                                    <div className="row mt-3">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="recibirinfo" id="recibirinfo" />
                                            <label className="form-check-label" htmlFor="recibirinfo">
                                                Deseo recibir información sobre libros, novedades y eventos de Agapea.com o sus librerías.
                                            </label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" name="politicauso" id="politicauso" />
                                            <label className="form-check-label" htmlFor="politicauso">
                                                He leído y acepto la política de privacidad y cookies y las condiciones de contratación y devolución
                                            </label>
                                        </div>
                                    </div>

                                    {/*<!-- boton finalizar pedido -->*/}
                                    <div className="row d-flex flex-row justify-content-center">
                                        <button type="submit" className="btn btn-primary">
                                            <i className="fa-solid fa-truck"></i> Finalizar Pedido
                                        </button>
                                    </div>                    
                                </div>
                            </form>
                        </div>
                        
                        
                        {/* ------ columna para elementos del pedido, subtotal, gastos envio y total ----*/}
                        <div className='col-4'>
                            <div className='container'>
                                <div className='row'><h6><strong>Resumen de la Cesta</strong></h6></div>
                                <hr></hr>
                                {
                                    itemsCarro.length === 0 ? 
                                    (
                                       <p>...no hay ningun libro añadido al carro de momento, sigue comprando....</p>     
                                    )
                                    :
                                    (
                                        <>
                                            {
                                                itemsCarro.map(
                                                    elemento => <ElementoPedido item={elemento} key={elemento.libroElemento.ISBN13}></ElementoPedido> 
                                                )
                                            }
                                            <div className='row'>
                                                <div className='col-10'><p><strong>SubTotal: </strong></p></div>
                                                <div className='col-2'><span style={{color:'red'}}>{parseFloat(subTotalPedido).toFixed(2)}€</span></div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-10'><p><strong>Gastos de envio y gestion: </strong></p></div>
                                                <div className='col-2'><span style={{color:'red'}}>{parseFloat(gastosEnvio).toFixed(2)}€</span></div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-10'><p><strong>Gastos Total a pagar: </strong></p></div>
                                                <div className='col-2'><span style={{color:'red'}}>{(parseFloat(subTotalPedido) + parseFloat(gastosEnvio)).toFixed(2)}€</span></div>
                                            </div>
                                            <div className='row'><small>El periodo de entrega es de <span style={{color:'green'}}>1 a 7 días laborables</span></small></div>
                                        </>
                                    )
                                }

                                <div className='row'>
                                    <div className='col-6'>
                                        <Link to="/Tienda/Libros/2-10" className='btn btn-outline-primary'>
                                            <i className='fa-solid fa-book'></i>Seguir Comprando
                                        </Link>
                                    </div>
                                    <div className='col-6'>
                                        <button onClick={HandlerSubmitCompra} className='btn btn-primary'>
                                            <i className='fa-solid fa-truck-fast'> </i> Finalizar Pedidio
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )
}

export default MostrarPedido;
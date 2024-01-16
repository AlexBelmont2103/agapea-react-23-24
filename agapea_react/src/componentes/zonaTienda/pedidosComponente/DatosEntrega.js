import { useState } from 'react';

//import { useClienteLogged } from '../../../App';
import {useClienteLoggedContext} from '../../../contextProviders/clienteLoggedContext'

function DatosEntrega( {datosEntrega, setDatosEntrega } ){
    //let { clienteLogged }=useClienteLogged();
    let { clienteLogged }=useClienteLoggedContext();
    //console.log('datos de contexto clientelogged...', clienteLogged);
    
    
    //------------------------------------ state del comp.----------------------
    let [ otraDireccion, setOtraDireccion ]=useState(false);
    let [ datosEnvioClienteLogged, setDatosEnvioClienteLogged]=useState(true);
    
    let direccionprincipal=clienteLogged.datoscliente.direcciones.filter( direc=>direc.esPrincipal===true)[0];



    //-------------------- funciones manejadoras de eventos -------------------------------------
    // change de radios direccion ppal/otra direccon y datos envio/otros datos
    function HandlerChangeRadios(ev){
        let { name,value }=ev.target;
        console.log('valor de ev.target, name y value...',ev.target,name,value);


        if (name==='direccionradios') {
                    switch (value) {
                        case 'direccionprincipal':
                            setOtraDireccion(false);
                            setDatosEntrega(
                                {
                                    ...datosEntrega,
                                    calle: direccionprincipal.calle,
                                    cp: direccionprincipal.cp,
                                    pais: direccionprincipal.pais,
                                    provincia: direccionprincipal.provincia,
                                    municipio: direccionprincipal.municipio
                                }
                            )                    
                            break;
            
                        case 'otradireccion':
                            setOtraDireccion(true);                
                            break;
            
                    
                        default:
                            break;
                    }
            
        } else if( name==='personaenvioradios'){
            switch (value) {
                case 'clienteloggedenvio':
                    setDatosEnvioClienteLogged(true);
                    setDatosEntrega(
                        {
                            ...datosEntrega,
                            nombreEnvio: clienteLogged.datoscliente.nombre,
                            apellidosEnvio: clienteLogged.datoscliente.apellidos,
                            telefonoContacto: clienteLogged.datoscliente.telefono,
                            emailEnvio: clienteLogged.datoscliente.cuenta.email
                        }
                    );
                    break;

                case 'otrapersonaenvio':
                    setDatosEnvioClienteLogged(false);
                    break;

                default:
                    break;
            }
        }
    }

    // change en inputs ....
    function HandlerChangeInputs(ev){
        let {name,value}=ev.target;
        setDatosEntrega(
            {
                ...datosEntrega,
                [name]: value
            }
        );
    }

    //-------------------------------------------------------------------------------------------------

    return (
        <>
            <div className="row mt-4">
                <div className="col-1"><img src="/images/img1_mostrar_pedido_datosentrega.png" style={{width: "40px",height:"26px"}} alt='...'/></div>
                <div className="col-11"><h4><strong>1.- Datos de entrega</strong></h4></div>
            </div>

            {/* -- fila de radios para seleccionar direccion principal de envio del cliente u otra nueva... -- */}
            <div className="row">

                <div className="form-check">
                    <input className="form-check-input" type="radio" name="direccionradios" id="direccionprincipal" value="direccionprincipal" defaultChecked onChange={HandlerChangeRadios}/>
                    <label className="form-check-label" htmlFor="direccionprincipal">
                        {direccionprincipal.calle}. {direccionprincipal.municipio.DMUN50}, {direccionprincipal.provincia.PRO} CP: {direccionprincipal.cp}. {direccionprincipal.pais}
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="direccionradios" id="direccionagapea" disabled />
                    <label className="form-check-label" htmlFor="direccionagapea">
                        Recoger en libreria Agapea (No disponible en este momento. Puede hacer el pedido para el envio a domicilio)
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="direccionradios" id="direccionotra" value="otradireccion" onChange={HandlerChangeRadios} />
                    <label className="form-check-label" htmlFor="direccionotra">
                        Recibir en otra direccion
                    </label>
                </div>

            </div>
            
            {/* -- fila de campos para nueva direccion envio solo si esta chequeado RADIO OTRA DIRECCION-- */}
            {
                    otraDireccion && (
                        <div className="row mt-2" id="filadireccioncontainer">

                            <div className="container" id="direccioncontainer">
                                <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="inputPais" className="form-label">Pais</label>
                                            <input type="text" className="form-control" id="inputPais" placeholder="España" name="pais" onChange={HandlerChangeInputs}/>
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="inputProvincia" className="form-label">Provincia*</label>
                                            <select id="inputProvincia" className="form-select" name="provincia" onChange={HandlerChangeInputs}>
                                                <option value="-1" defaultValue={true}> - Seleccionar Provincia - </option>
                                            </select>
                                        </div>
                                </div>
                                <div className='row'>
                                        <div className="col-6">
                                            <label htmlFor="inputCalle" className="form-label">Direccion completa*</label>
                                            <input type="text" className="form-control" id="inputCalle" placeholder="Mi Direccion" name="calle" onChange={HandlerChangeInputs}/>
                                        </div>
            
                                        <div className="col-2">
                                            <label htmlFor="inputCP" className="form-label">Codigo Postal*</label>
                                            <input type="text" className="form-control" id="inputCP" placeholder="Codigo Postal: 28803" name="cp" onChange={HandlerChangeInputs}/>
                                        </div>
                                        
                                        
                                        <div className="col-4">
                                            <label htmlFor="inputMunicipio" className="form-label">Localidad*</label>
                                            <select id="inputMunicipio" className="form-select" name="municipio" onChange={HandlerChangeInputs} disabled >
                                                <option value="-1" defaultValue={true}> - Selecciona un Municipio -</option>
                                            </select>
                                        </div>
                                </div>           
                            </div>
            
                        </div>     
                    )
            }


            {/* -- fila de radios para seleccionar datos de contacto persona de envio  -- */}
            <div className="row">
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="personaenvioradios" id="clienteloggedenvio" value="clienteloggedenvio" defaultChecked onChange={HandlerChangeRadios}/>
                    <label className="form-check-label" htmlFor="clienteloggedenvio">
                         Datos de usuario registrado
                         {clienteLogged.datoscliente.cuenta.email} ( {clienteLogged.datoscliente.cuenta.login} )
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="personaenvioradios" id="otrapersonaenvio" value="otrapersonaenvio" onChange={HandlerChangeRadios}/>
                    <label className="form-check-label" htmlFor="otrapersonaenvio">
                        Usar otros datos
                    </label>
                </div>
            </div>        

            {/* -- fila de campos para datos de persona de envio -- */}
            <div className='row'>
                {
                    datosEnvioClienteLogged ? 
                    (
                        <>
                            <div className='col-3'></div>
                            <div className="col-6">
                                <label htmlFor="telefonoContacto" className="form-label">Telefono de contacto*</label>
                                <input type="text" className="form-control" id="telefonoContacto" placeholder={clienteLogged.datoscliente.telefono} name="telefonoContacto" onChange={HandlerChangeInputs}/>
                            </div>                                                
                        </>
                    )
                    :
                    (
                        <>
                            <div className='col-6'>
                                <label htmlFor="nombreEnvio" className="form-label">Nombre*</label>
                                <input type="text" className="form-control" id="nombreEnvio"  name="nombreEnvio" onChange={HandlerChangeInputs}/>
                            </div>
                            <div className='col-6'>
                                <label htmlFor="apellidosEnvio" className="form-label">Apellidos*</label>
                                <input type="text" className="form-control" id="apellidosEnvio"  name="apellidosEnvio" onChange={HandlerChangeInputs}/>
                            </div>

                            <div className='col-6'>
                                <label htmlFor="emailEnvio" className="form-label">Correo Electronico*</label>
                                <input type="text" className="form-control" id="emailEnvio"  name="emailEnvio" onChange={HandlerChangeInputs}/>
                            </div>
                            <div className='col-6'>
                                <label htmlFor="telefonoContactoNuevo" className="form-label">Telefono de contacto*</label>
                                <input type="text" className="form-control" id="telefonoContactoNuevo"  name="telefonoContacto" onChange={HandlerChangeInputs}/>
                            </div>
                        </>
                    )                    
                }
                <div className='col-12'>
                    <label htmlFor="otrosDatos" className="form-label">Otros datos de entrega*</label>
                    <input type="text" className="form-control" id="otrosDatos"  name="otrosDatos" onChange={HandlerChangeInputs}/>
                </div>
            </div>       
        </>
    )
}
export default DatosEntrega;
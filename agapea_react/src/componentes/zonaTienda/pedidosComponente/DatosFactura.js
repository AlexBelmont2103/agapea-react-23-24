import { useState } from 'react';

function DatosFactura( {datosFactura, setDatosFactura} ){

    let [ checkEmpresa, setCheckEmpresa]=useState(true);
    let [ checkDireccionFactura, setCheckDireccionFactura]=useState(true);

    function HandlerInputChange(ev){
        let {name,value}=ev.target;
        setDatosFactura(
            {
                ...datosFactura,
                [name]: value
            }
        );
    }

    return (
        <>
                        <div className="row" id="filafacturacontainer">
                            <div className="container" id="facturacontainer">

                                <div className="row mt-4">
                                    <div className="col-1"><img src="/images/img2_mostrar_pedido_factura.png" style={ {width: "40px",height:"26px"} } alt="..."/></div>
                                    <div className="col-11"><h4><strong>2.- Datos para su factura</strong></h4></div>
                                </div>                            
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="tipofactura" id="datosfacturaempresa" defaultChecked value="facturaempresa" onChange={ ()=>{ setCheckEmpresa(true); setDatosFactura({...datosFactura, tipofactura:'facturaempresa'}); } } />
                                            <label className="form-check-label" htmlhtmlFor="datosfacturaempresa">
                                                Empresa
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="tipofactura" id="datosfacturaparticular" value="facturaparticular" onChange={ ()=>{ setCheckEmpresa(false); setDatosFactura({...datosFactura, tipofactura:'facturaparticular'}); } } />
                                            <label className="form-check-label" htmlhtmlFor="datosfacturaparticular">
                                                Profesional, particular o autononmo
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <label htmlhtmlFor="nombreFactura" className="form-label">{ checkEmpresa ? 'Nombre de la empresa' : 'Apellidos y Nombre' } </label>
                                        <input type="text" className="form-control" id="nombreFactura" name="nombreFactura" onChange={HandlerInputChange} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlhtmlFor="docFactura" className="form-label">{ checkEmpresa ? 'CIF' : 'NIF' }</label>
                                        <input type="text" className="form-control" id="docFactura" name="docFactura" onChange={HandlerInputChange}/>
                                    </div>
                                </div>

                                {/* fila checkbox direccion de facturacio igual q la de envio */}
                                <div className="row">
                                    <div className="col">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="checkdireccionfactura" defaultChecked onChange={(ev)=>setCheckDireccionFactura(ev.target.checked)}/>
                                            <label className="form-check-label" htmlFor="checkdireccionfactura">
                                                Direccion de facturacion igual que la de envio
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* fila para nueva direccion de facturacion si checkbox anterior no esta chequeado*/}
                                {
                                    ! checkDireccionFactura && (
                                        <div className="row mt-2" id="filadireccionfacturacioncontainer">
                                            <div className="container" id="direccionfacturacioncontainer">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <label htmlFor="inputPaisFactura" className="form-label">Pais</label>
                                                        <input type="text" className="form-control" id="inputPaisFactura" placeholder="España" name="paisfactura" />
                                                    </div>
                                                    <div className="col-6">
                                                        <label htmlFor="inputProvinciaFactura" className="form-label">Provincia*</label>
                                                        <select id="inputProvinciaFactura" className="form-select" name="provinciafactura">
                                                            <option value="-1" defaultValue={true}> - Seleccionar Provincia - </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-6">
                                                        <label htmlFor="inputCalleFactura" className="form-label">Direccion completa*</label>
                                                        <input type="text" className="form-control" id="inputCalleFactura" placeholder="Mi Direccion" name="callefactura" />
                                                    </div>

                                                    <div className="col-2">
                                                        <label htmlFor="inputCPFactura" className="form-label">Codigo Postal*</label>
                                                        <input type="text" className="form-control" id="inputCPFactura" placeholder="Codigo Postal: 28803" name="cpfactura" />
                                                    </div>


                                                    <div className="col-4">
                                                        <label htmlFor="inputMunicipioFactura" className="form-label">Localidad*</label>
                                                        <select id="inputMunicipioFactura" className="form-select" name="municipiofactura" disabled>
                                                            <option value="-1" defaultValue={true}> - Selecciona un Municipio -</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>  
                                    )
                                }
                              
                            </div>
                        </div>        
        </>       
    )

}
export default DatosFactura;
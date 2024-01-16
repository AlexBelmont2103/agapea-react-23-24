 import{useState, useEffect} from 'react';
 import pedidoRESTService from '../../../servicios/restPedido';
 import { AgregarDireccion, ModificarDireccion } from '../../../servicios/restCliente';
 import { useClienteLoggedContext } from '../../../contextProviders/clienteLoggedContext';
function ModalDirecciones( {marcador} ) {
        //#region --------------- state manejado por el componente (global por context-api o local) ------------------
        console.log("Id del marcador desde el modal",marcador._id);
        const {clienteLogged, dispatch} = useClienteLoggedContext();
        const [calle, setCalle] = useState('');
        const [cp, setCp] = useState('');
        const [pais, setPais] = useState('');
        const [provincia, setProvincia] = useState('');
        const [municipio, setMunicipio] = useState('');
        //console.log(clienteLogged.tokensesion);
        //#endregion

        //#region --------------- efectos del componente -------------------------------------------------------------
        //Efecto para cargar las provincias al renderizar el componente
        useEffect(() => {
            //Crear funcion asincrona para cargar provincias
            const cargarProvincias = async () => {
                //Recuperar provincias
                const _provincias = await pedidoRESTService.recuperarProvincias();
                //Cargar provincias en el select
                const _selectProvincias = document.querySelector('#inputProvincia');
                //Vaciar select de provincias
                _selectProvincias.innerHTML = '';
                //Crear option por defecto
                const _optionDefault = document.createElement('option');
                _optionDefault.value = 0;
                _optionDefault.textContent = ' - Seleccionar Provincia - ';
                _optionDefault.selected = true;
                //Añadir option por defecto al select
                _selectProvincias.appendChild(_optionDefault);
                //Recorrer array de provincias
                _provincias.forEach((provincia) => {
                    //Crear option
                    const _option = document.createElement('option');
                    //Asignar valor y texto al option
                    _option.value = provincia.CPRO+"-"+provincia.PRO;
                    _option.textContent = provincia.PRO;
                    //Comprobamos que marcador tiene _id
                    if(marcador?._id !== undefined){
                        //Si el marcador tiene _id, comprobamos si la provincia es la misma que la del marcador
                        if(marcador.provincia.CPRO === provincia.CPRO){
                            _option.selected = true;
                        }
                    }
                    //Añadir option al select
                    _selectProvincias.appendChild(_option);
                });
            };
            //Llamar a la funcion asincrona
            cargarProvincias();
            
        }, []);
        //Efecto para cargar los municipios al seleccionar una provincia
        useEffect(() => {
            //Crear funcion asincrona para cargar municipios
            const cargarMunicipios = async () => {
                //Recuperar provincia seleccionada
                const _codigoProvincia = provincia.split('-')[0];
                const _municipios = await pedidoRESTService.recuperarMunicipios(_codigoProvincia);
                //Cargar municipios en el select
                console.log(_municipios);
                const _selectMunicipios = document.querySelector('#inputMunicipio');
                //Vaciar select de municipios
                _selectMunicipios.innerHTML = '';
                //Crear option por defecto
                const _optionDefault = document.createElement('option');
                _optionDefault.value = 0;
                _optionDefault.textContent = ' - Selecciona un Municipio -';
                _optionDefault.selected = true;
                //Añadir option por defecto al select
                _selectMunicipios.appendChild(_optionDefault);
                //Recorrer array de municipios
                _municipios.forEach((municipio) => {
                    //Crear option
                    const _option = document.createElement('option');
                    //Asignar valor y texto al option
                    _option.value = municipio.CMUM+"-"+municipio.DMUN50;
                    _option.textContent = municipio.DMUN50;
                    //Si el marcador tiene _id, comprobamos si el municipio es el mismo que el del marcador
                    if(marcador?._id !== undefined){
                        if(marcador?.municipio.CMUM === municipio.CMUM && marcador?.municipio.CPRO === municipio.CPRO){
                            _option.selected = true;
                        }
                    }
                    //Añadir option al select
                    _selectMunicipios.appendChild(_option);
                });
            };
            //Llamar a la funcion asincrona
            cargarMunicipios();
        }, [provincia]);
        //Efecto para mostrar los campos de marcador si existe
        useEffect(() => {
            if (marcador?._id !== undefined) {
                setCalle(marcador.calle);
                setCp(marcador.cp);
                setPais(marcador.pais);
                setProvincia(marcador.provincia.CPRO+"-"+marcador.provincia.PRO);
                setMunicipio(marcador.municipio.CMUM+"-"+marcador.municipio.DMUN50);
            } else {
                setCalle('');
                setCp('');
                setPais('');
                setProvincia('');
                setMunicipio('');
            }
        }, [marcador]);
        //#endregion

        //#region --------------- funciones manejadoras de eventos ----------------------------------------------------
        function handleChangeInput(ev){
            switch (ev.target.id) {
                case 'inputCalle':
                    setCalle(ev.target.value);
                    break;
                case 'inputCP':
                    setCp(ev.target.value);
                    break;
                case 'inputPais':
                    setPais(ev.target.value);
                    break;
                case 'inputProvincia':
                    setProvincia(ev.target.value);
                    break;
                case 'inputMunicipio':
                    setMunicipio(ev.target.value);
                    break;
                default:
                    break;
            }
        }
        async function handleSubmit(ev){
            ev.preventDefault();

            //Si el marcador tiene _id, es que existe, por lo que se va a modificar
            if(marcador?._id !== undefined){
                //Modificar marcador
                const _direccionActualizada = {
                    _id: marcador._id,
                    calle: calle,
                    cp: cp,
                    pais: pais,
                    provincia: {
                        CPRO: provincia.split('-')[0],
                        PRO: provincia.split('-')[1]
                    },
                    municipio: {
                        CPRO: provincia.split('-')[0],
                        CMUM: municipio.split('-')[0],
                        DMUN50: municipio.split('-')[1],
                        CUN:"0000000"
                    },
                    esFacturacion: marcador.esFacturacion,
                    esPrincipal: marcador.esPrincipal,
                };
                //Llamar a la funcion para modificar el marcador
                console.log("Direccion actualizada para mandar al servicio REST",_direccionActualizada);
                let _respuestaModificarDireccion = await ModificarDireccion(_direccionActualizada, clienteLogged.tokensesion);
                console.log("Respuesta del servicio REST",_respuestaModificarDireccion);
                //Si todo ok, actualizar datos del cliente
                if(_respuestaModificarDireccion.codigo === 0){
                    //Los datos del cliente deben in en la respuesta del servicio REST
                    let _datosCliente = _respuestaModificarDireccion.datoscliente;
                    let _tokensesion = _respuestaModificarDireccion.jwt;
                    console.log("Datos del cliente",_datosCliente);
                    console.log("Token de sesion",_tokensesion);
                    let payload = {
                        datoscliente: _datosCliente,
                        tokensesion: _tokensesion};
                    console.log("Datos del cliente",_datosCliente);
                    //Actualizar datos del cliente
                    dispatch({type: 'CLIENTE_UPDATE', payload: payload});
                }
            }
            //Si el marcador no tiene _id, es que no existe, por lo que se va a crear
            else{
                            //Comprobar validez de los campos
            if(calle.trim() === '' || cp.trim() === '' || pais.trim() === '' || provincia.trim() === '' || municipio.trim() === ''){
                alert('Todos los campos son obligatorios');
                return false;
            }
                //Crear marcador
                const _nuevaDireccion = {
                    calle: calle,
                    cp: cp,
                    pais: pais,
                    provincia: {
                        CPRO: provincia.split('-')[0],
                        PRO: provincia.split('-')[1]
                    },
                    municipio: {
                        CPRO: provincia.split('-')[0],
                        CMUM: municipio.split('-')[0],
                        DMUN50: municipio.split('-')[1],
                        CUN:"0000000"
                    },
                    esFacturacion: false,
                    esPrincipal: false,
                };
                //Llamar a la funcion para crear el marcador
                console.log("Direccion nueva para mandar al servicio REST",_nuevaDireccion);
                let _respuestaAgregarDireccion = await AgregarDireccion(_nuevaDireccion, clienteLogged.tokensesion);
                console.log("Respuesta del servicio REST",_respuestaAgregarDireccion);
                //Si todo ok, actualizar datos del cliente
                if(_respuestaAgregarDireccion.codigo === 0){
                    //Los datos del cliente deben in en la respuesta del servicio REST
                    let _datosCliente = _respuestaAgregarDireccion.datoscliente;
                    let _tokensesion = _respuestaAgregarDireccion.jwt;
                    let payload = {
                        datoscliente: _datosCliente,
                        tokensesion: _tokensesion};
                    console.log("Datos del cliente",_datosCliente);
                    //Actualizar datos del cliente
                    dispatch({type: 'CLIENTE_UPDATE', payload: payload});
                }
            }
            //Cerrar el modal haciendo click en el botón close
            document.querySelector('#btnCerrar').click();
        }

        //#endregion


        return (
                <div  className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Nueva Direccion</h5>
                        <button  type="button" className="btn-close" id="btnCerrar" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <p>Si desea que enviemos el pedido a una dirección distinta de la de facturación, modifique los campos a </p>
                                    <p>continuación según proceda.</p>
                                </div>
                                <div className="row">
                                    
                                        <div className="col-12">
                                        <label htmlFor="inputCalle" className="form-label">Direccion de Envio:</label>
                                        <input type="text" className="form-control" id="inputCalle" placeholder="Mi Direccion" value={calle} onChange={handleChangeInput} />
                                        </div>

                                        <div className="col-6">
                                        <label htmlFor="inputCP" className="form-label">Codigo Postal:</label>
                                        <input type="text" className="form-control" id="inputCP" placeholder="Codigo Postal: 28803" value={cp} onChange={handleChangeInput} />
                                        </div>
                                        <div className="col-6">
                                        <label htmlFor="inputPais" className="form-label">Pais:</label>
                                        <input type="text" className="form-control" id="inputPais" placeholder="España" value={pais} onChange={handleChangeInput} />
                                        </div>
                                        
                                        
                                        <div className="col-6">
                                        <label htmlFor="inputProvincia" className="form-label">Provincia:</label>
                                        <select id="inputProvincia" className="form-select" value={provincia} onChange={handleChangeInput}>
                                            <option value="0" defaultValue={true}> - Seleccionar Provincia - </option>
                                        </select>
                                        </div>
                                        <div className="col-6">
                                        <label htmlFor="inputMunicipio" className="form-label">Municipio:</label>
                                        <select id="inputMunicipio" className="form-select" value={municipio} onChange={handleChangeInput}>
                                            <option value="0" defaultValue={true}> - Selecciona un Municipio -</option>
                                        </select>
                                        </div>

                                        <hr/>  
                                        <div className="col-12">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary" id="btnCrearDireccion" onClick={handleSubmit}> Crear/Modificar direccion</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
        );
}

export default ModalDirecciones;
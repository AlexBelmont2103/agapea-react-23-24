import ModalDirecciones from './ModalDirecciones';
import {useState, useEffect} from 'react';
import { useClienteLoggedContext } from '../../../contextProviders/clienteLoggedContext';
import { SubirFoto, ActualizarCliente, EliminarDireccion, HacerDirPrincipal, EliminarPrincipal } from '../../../servicios/restCliente';

 
function InicioPanel(  ) {
        //#region --------------- state manejado por el componente (global por context-api o local) ------------------
        //#endregion
        const { clienteLogged, dispatch } = useClienteLoggedContext();
        console.log(clienteLogged);
        let clienteaux = clienteLogged.datoscliente;
        const [imagenAvatarBASE64, setImagenAvatarBASE64] = useState(clienteaux.cuenta.imagenAvatarBASE64);
        const [email, setEmail] = useState(clienteaux.cuenta.email);
        const [password, setPassword] = useState();
        const [repassword, setRepassword] = useState();
        const [nombre, setNombre] = useState(clienteaux.nombre);
        const [apellidos, setApellidos] = useState(clienteaux.apellidos);
        const [telefono, setTelefono] = useState(clienteaux.telefono);
        const [login, setLogin] = useState(clienteaux.cuenta.login);
        const [genero, setGenero] = useState();
        const [anio, setAnio] = useState();
        const [mes, setMes] = useState();
        const [dia, setDia] = useState();
        const [descripcion, setDescripcion] = useState();
        const [marcador, setMarcador] = useState({});

        //#region --------------- efectos del componente -------------------------------------------------------------
        //Efecto para cargar los años en el select de años y los meses en el select de meses
        useEffect(() => {
            let _selectAnio = document.getElementById('anio');
            for (let i = 2005; i >= 1930; i--) {
                let _option = document.createElement('option');
                _option.value = i;
                _option.innerHTML = i;
                _selectAnio.appendChild(_option);
            }
            let _selectMes = document.getElementById('mes');
            _selectMes.innerHTML = '';
            let _option = document.createElement('option');
            _option.value = -1;
            _option.innerHTML = 'Elige mes';
            _selectMes.appendChild(_option);
            for (let i = 1; i <= 12; i++) {
                let _option = document.createElement('option');
                _option.value = i;
                _option.innerHTML = i;
                _selectMes.appendChild(_option);
            }

        }, []);
        //Efecto para cargar los dias en el select de dias
        useEffect(() => {
            let _selectDia = document.getElementById('dia');
            _selectDia.innerHTML = '';
            let _option = document.createElement('option');
            _option.value = -1;
            _option.innerHTML = 'Elige dia';
            _selectDia.appendChild(_option);
            //Si el mes es febrero y el año es bisiesto
            if (mes == 2 && anio % 4 == 0) {
                for (let i = 1; i <= 29; i++) {
                    let _option = document.createElement('option');
                    _option.value = i;
                    _option.innerHTML = i;
                    _selectDia.appendChild(_option);
                }
            }else if (mes == 2 && anio % 4 != 0) {
                for (let i = 1; i <= 28; i++) {
                    let _option = document.createElement('option');
                    _option.value = i;
                    _option.innerHTML = i;
                    _selectDia.appendChild(_option);
                }
            }else if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
                for (let i = 1; i <= 30; i++) {
                    let _option = document.createElement('option');
                    _option.value = i;
                    _option.innerHTML = i;
                    _selectDia.appendChild(_option);
                }
            }else{
                for (let i = 1; i <= 31; i++) {
                    let _option = document.createElement('option');
                    _option.value = i;
                    _option.innerHTML = i;
                    _selectDia.appendChild(_option);
                }
            }
        }, [mes, anio]);
        
        //#endregion

        //#region --------------- funciones manejadoras de eventos ----------------------------------------------------
        //Funcion manejadora del evento click del boton de subir imagen
        async function handleChangeImagen(ev){
            let _fichero = ev.target.files[0];
            let _fileReader = new FileReader();
            _fileReader.onload = async function(ev){
                let _imagenBASE64 = ev.target.result;
                setImagenAvatarBASE64(_imagenBASE64);
                //Desbloquear el boton de subir imagen
                
            }
            _fileReader.readAsDataURL(_fichero);
        }
        //Funcion para mandar la imagen al servidor
        async function handleUploadImagen(ev){
            console.log(ev);
        }
            
        //Funcion handle de los campos de texto
        function handleChangeInput(ev) {
            switch (ev.target.id) {
                case 'inputEmail':
                    setEmail(ev.target.value);
                    break;
                case 'inputPass':
                    setPassword(ev.target.value);
                    break;
                case 'inputPassRep':
                    setRepassword(ev.target.value);
                    break;
                case 'inputNombre':
                    setNombre(ev.target.value);
                    break;
                case 'inputApellidos':
                    setApellidos(ev.target.value);
                    break;
                case 'inputTlfn':
                    setTelefono(ev.target.value);
                    break;
                case 'inputUsuario':
                    setLogin(ev.target.value); 
                    break;
                case 'genero':
                    setGenero(ev.target.value);
                    break;
                case 'textArea':
                    setDescripcion(ev.target.value);
                    break;
                case 'anio':
                    setAnio(ev.target.value);
                    break;
                case 'mes':
                    setMes(ev.target.value);
                    break;
                case 'dia':
                    setDia(ev.target.value);
                    break;
                default:
                    break;
            }
        }
        //Funcion para enviar los datos de los campos de texto al servidor
        async function handleSubmit(ev) {
            ev.preventDefault();
            if(password == undefined){
                password = clienteaux.cuenta.password;
            }
            setDescripcion(document.getElementById('textArea').value);
            let _datosCliente = {
                nombre: nombre,
                apellidos: apellidos,
                cuenta: {
                    email: email,
                    password: password,
                    login: login
                },
                telefono: telefono,
                genero: genero,
                fechaNacimiento: dia + '/' + mes + '/' + anio,
                descripcion: descripcion
            };
            console.log(_datosCliente);
            //Validar los datos
            let _errores = [];
            //Validar email
            if (!new RegExp('^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\.\\w{2,3})+$').test(_datosCliente.cuenta.email)) {
                _errores.push('* Formato de email incorrecto');
            }
            //Validar password
            if (new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])\S{8,}$').test(_datosCliente.cuenta.password)) {
                _errores.push('* En la password al menos una MAYS, MINS, NUMERO y caracter raro');
            }
            //Validar coincidencia de password
            if (_datosCliente.cuenta.password != repassword) {
                _errores.push('* Las passwords no coinciden');
            }
            //Validar telefono
            if (!new RegExp(/^\d{3}(\s?\d{2}){3}$/).test(_datosCliente.telefono)) {
                _errores.push('* El telefono tiene q tener formato 666 11 22 33');
            }
            //Validar fecha de nacimiento
            if (_datosCliente.fechaNacimiento == 'Elige dia/Elige mes/Elige año') {
                _errores.push('* Debes elegir una fecha de nacimiento');
            }
            //Si hay errores
            if (_errores.length > 0) {
                //Mostrar los errores
                let _htmlErrores = '<ul>';
                for (let i = 0; i < _errores.length; i++) {
                    _htmlErrores += '<li>' + _errores[i] + '</li>';
                }
                _htmlErrores += '</ul>';
                document.getElementById('mensajeServicioREST').innerHTML = _htmlErrores;
            } else {
                //No hay errores
                //Enviar los datos al servidor
                //Construir objeto con datos cliente y jwt
                let datosEnviar = {
                    datosCliente: _datosCliente,
                    jwt: clienteLogged.tokensesion
                };
                let _respuestaActualizarCliente = await ActualizarCliente(datosEnviar);
                console.log(_respuestaActualizarCliente);
                //Si todo ok, actualizamos el cliente en el state
                if (_respuestaActualizarCliente.codigo == 0) {
                    //Actualizar el cliente en el state
                    dispatch({
                        type: 'CLIENTE_UPDATE',
                        datoscliente: _respuestaActualizarCliente.datoscliente,
                        tokensesion: _respuestaActualizarCliente.tokensesion
                    });
                    //Mostrar mensaje de ok
                    document.getElementById('mensajeServicioREST').innerHTML = '<div class="alert alert-success">Datos actualizados correctamente</div>';
                } else {
                    //Mostrar mensaje de error
                    document.getElementById('mensajeServicioREST').innerHTML = '<div class="alert alert-danger">Error al actualizar los datos</div>';
                }
                
            }
        }
        async function handleBorrar(ev){
            let _idDireccion = ev.target.getAttribute('direccion'); //id de la direccion a borrar
            console.log(_idDireccion);
            let _respuestaBorrarDireccion = await EliminarDireccion(_idDireccion, clienteLogged.tokensesion);
            console.log("Respuesta del servicio REST...",_respuestaBorrarDireccion);
            //Si todo ok, actualizamos el cliente en el state
            let _datosCliente = _respuestaBorrarDireccion.datoscliente;
            let _tokensesion = _respuestaBorrarDireccion.jwt;
            let payload = {
                datoscliente: _datosCliente,
                tokensesion: _tokensesion};
            if(_respuestaBorrarDireccion.codigo == 0){
                //Actualizar el cliente en el state
                dispatch({
                    type: 'CLIENTE_UPDATE',
                    payload: payload
                });
            }
        }
        async function hacerPrincipal(ev){
            let _idDireccion = ev.target.getAttribute('direccion'); //id de la direccion a borrar
            console.log(_idDireccion);
            //Primero buscamos la direccion principal en los datos de clienteLogged
            let _direccionPrincipal = clienteLogged.datoscliente.direcciones.find((direccion) => {return direccion.esPrincipal;});
            let _idDireccionPrincipal = _direccionPrincipal._id;
            //Hacemos peticion al servicio rest para modificar la direccion principal
            let _respuestaEliminarPrincipal = await EliminarPrincipal(_idDireccionPrincipal, clienteLogged.tokensesion);
            //Si todo ok, actualizamos la direccion que queremos hacer principal
            if(_respuestaEliminarPrincipal.codigo==0){
                let _respuestaHacerPrincipal = await HacerDirPrincipal(_idDireccion, clienteLogged.tokensesion);
                //Si todo ok, actualizamos el cliente en el state
                let _datosCliente = _respuestaHacerPrincipal.datoscliente;
                let _tokensesion = _respuestaHacerPrincipal.jwt;
                let payload = {
                    datoscliente: _datosCliente,
                    tokensesion: _tokensesion};
                    if(_respuestaHacerPrincipal.codigo == 0){
                        //Actualizar el cliente en el state
                        dispatch({
                            type: 'CLIENTE_UPDATE',
                            payload: payload
                        });
                    }                
                }

         }
        //#endregion


        return (
<div className="container">
    <div className="row">
        <div className="col">
            <h2>Mi perfil</h2>
            <div></div>            
                <div className="alert alert-secondary" data-bs-toggle="collapse" href="#collapseDatos">Datos de perfil</div>          
                <div className="collapse" id="collapseDatos">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="row text-muted">Correo electrónico</div>
                            <div className="row"><input type="text" id="inputEmail" className="input-group-text" style={{width:"90%"}} value={email} onChange={handleChangeInput} /></div>
                            <div className="row text-muted">Contraseña</div>
                            <div className="row"><input type="password" id="inputPass" className="input-group-text" style={{width:"90%"}} value={password} onChange={handleChangeInput} /></div>
                            <div className="row text-muted">Nombre</div>
                            <div className="row"><input type="text" id="inputNombre" className="input-group-text" style={{width:"90%"}} value={nombre} onChange={handleChangeInput}  /></div>

                        </div>

                        <div className="col-sm-6">
                            <div className="row text-muted">Teléfono</div>
                            <div className="row"><input type="text" id="inputTlfn" className="input-group-text" style={{width:"90%"}} value={telefono} onChange={handleChangeInput} /></div>
                            <div className="row text-muted">Repetir la contraseña</div>
                            <div className="row"><input type="password" id="inputPassRep" className="input-group-text" style={{width:"90%"}} value={repassword} onChange={handleChangeInput} /></div>
                            <div className="row text-muted">Apellidos</div>
                            <div className="row"><input type="text" id="inputApellidos" className="input-group-text" style={{width:"90%"}} value={apellidos} onChange={handleChangeInput} /></div>

                        </div>
                    </div>
                    <div className="row"><span></span></div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="text-muted">Foto</div>
                            <div id="avatarPerfil" className="card" style={{width:"200px",height:"250px", backgroundColor:"aliceblue"}}>
                                <input type="file" accept="image/*" id="selectorImagen"  style={{visibility:"hidden"}} onChange={handleChangeImagen} />
                                <a onClick={ ()=> document.getElementById('selectorImagen').click()}>
                                    <img id="imagenUsuario" style={{height:"250px",width:"200px"}} alt="..." src={imagenAvatarBASE64} />
                                </a>
                            </div>
                            <button type="button" 
                                    className="btn btn-link btn-sm"
                                    id="botonUploadImagen" 
                                    onClick={handleUploadImagen}
                                    disabled> + Sube una foto</button>
                            <div id="mensajeServicioREST"></div>
                        </div>
                        <div className="col-sm-8">
                            <div className="row text-muted">Usuario</div>
                            <div className="row"><input type="text" id="inputUsuario" className="input-group-sm" value={login} onChange={handleChangeInput}  /></div>
                            <div className="row text-muted">Genero</div>
                            <div className="row">
                                <select className="form-select" id="genero" aria-label="Elige genero" onChange={handleChangeInput} >
                                    <option value="0" selected>Elige genero</option>
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                </select>
                            </div>
                            <div className="row text-muted">Fecha de nacimiento</div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <select  id="dia" className="form-select" onChange={handleChangeInput} >
                                        <option value="-1" defaultValue={true}>Elige día</option>
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <select  id="mes" className="form-select" onChange={handleChangeInput} >
                                        <option value="-1" defaultValue={true}>Elige mes</option>
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <select  id="anio" className="form-select" onChange={handleChangeInput} >
                                        <option value="-1" defaultValue={true}>Elige año</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row text-muted">Descripcion</div>
                            <div className="row"><textarea id="textArea" value={descripcion}></textarea> </div>
                            <div className="ro2 align-text-top m-2">
                                    <a href=""> Darme de baja</a>
                                    <button type="submit" className="m-10 btn btn-primary" onClick={handleSubmit}>Modificar Datos</button>
                            </div>

                        </div>
                    </div>
                </div>              

            <div className="alert alert-secondary" data-bs-toggle="collapse" href="#collapseDirecciones">Direcciones</div>
            <div className="collapse" id="collapseDirecciones">
                <div>
                    <p> Guarda todas tus direcciones de envío y elige la que usarás por defecto donde llegarán tus pedidos.</p>

                   <p> Estas son las direcciones a las que puedes hacer tus envíos. Las direcciones de envío serán las que elijas mientras que la
                        facturación será la misma en todas las direcciones:
                    </p>
                    {/*Resultado del efecto para renderizar direcciones */
                        clienteLogged.datoscliente.direcciones.map((direccion, i) => {
                            return (
                                <div className="card" key={i}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <h5 className="card-title">{direccion.calle}</h5>
                                                <p className="card-text">{direccion.direccion}</p>
                                                <p className="card-text">{direccion.cp} {direccion.municipio.DMUN50} ({direccion.provincia.PRO})</p>
                                                <p className="card-text">{direccion.pais}</p>
                                                {direccion.esPrincipal ? <p className="card-text">Direccion principal</p> : <button type="button" className="btn btn-link" direccion={direccion._id} onClick={hacerPrincipal}>Hacer principal</button>}
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => setMarcador(direccion)}>Modificar</button>

                                                    </div>
                                                    <div className="col-sm-6">
                                                        <button type="button" className="btn btn-danger" onClick={handleBorrar} direccion={direccion._id}>Borrar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <hr/>
                {/*-- listado de direcciones del cliente para borrar/modificar --*/}

                {/*-- Button trigger modal --*/}
                <button  type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => setMarcador({})}>
                  + Nueva Direccion
                </button>

                {/*-- Modal --*/}
                <ModalDirecciones marcador={marcador}></ModalDirecciones>

            </div>
        </div>
    </div>
</div> 
        );
}

export default InicioPanel;
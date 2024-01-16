import { useEffect, useState } from "react";
import { useParams } from  'react-router-dom'; //<---- hook de REACT-ROUTER para extraer parametros de la ruta (path)
                                              //devuleve un objeto asi: { nombre_parametro: valor, nombre_parametro: valor, ....}
import { useItemsCarroContext } from "../../../contextProviders/itemsCarroContext";
import tiendaRESTService from '../../../servicios/restTienda';
import {crearListaDeseos} from '../../../servicios/restCliente';
import { useClienteLoggedContext } from "../../../contextProviders/clienteLoggedContext";
import Valoracion from "./Valoracion";
import ModalListas from "./ModalListas";


function MostrarLibro(){

    const { itemsCarro } = useItemsCarroContext();
    const { clienteLogged } = useClienteLoggedContext();
    const { dispatch: itemsCarroDispatch } = useItemsCarroContext();
    const { dispatch: clienteLoggedDispatch } = useClienteLoggedContext();
    let { isbn13 }=useParams(); 
    let [ libro, setLibro]=useState( {} );
    const [desplegado, setDesplegado] = useState(false);
    const [listaDeseos, setListaDeseos] = useState([]);


    useEffect(
        function(){
            //hacer peticion fetch para recuperar libro con ese isbn13 y rellenar la variable del state "libro" con setLibro   
            //invocando a tiendaRestService.recuperarLibro(....)
            async function peticionLibroAMostrar(isbn){
                let _librorecup=await tiendaRESTService.recuperarLibro(isbn);
                setLibro(_librorecup);    
            }
            peticionLibroAMostrar(isbn13);
        },
        []
    );
    function agregarItemPedido(ev) {
        ev.preventDefault();
        let _itemEncontrado = itemsCarro.find((item) => {
          return item.libroElemento.ISBN13 === libro.ISBN13;
        });
        if (_itemEncontrado === undefined) {
            itemsCarroDispatch({
            type: "ADD_NUEVO_LIBRO",
            payload: {
              libroElemento: libro,
              cantidadElemento: 1,
            },
          });
        } else {
            itemsCarroDispatch({
            type: "SUMAR_CANTIDAD_LIBRO",
            payload: {
              isbn13: libro.ISBN13,
              cantidadElemento: 1,
            },
          });
        }
      }

    function handleDesplegarListas() {
        setDesplegado(!desplegado);
    }

    async function crearNuevaLista() {
        let nombreLista = prompt("Introduzca el nombre de la lista");
        if (nombreLista) {
            console.log("Creando lista de deseos con nombre: " + nombreLista);
            let _respServer = await crearListaDeseos(nombreLista, clienteLogged.tokensesion);
            console.log(_respServer);
            if (_respServer.codigo === 0) {
                const _payload = {
                    datoscliente: _respServer.datoscliente,
                    tokensesion: _respServer.jwt
                };
                clienteLoggedDispatch({ type: "CLIENTE_UPDATE", payload: _payload });
            }
        }
    }

    return(
        <div className="container">
            <div className="row">
                <div className="col-8">
                    <div className="mb-3" style={{ maxWidth: "540px"}}>
                        <div className="row g-0">
                            <div className="col-md-4" style={{height: "170px"}}>
                                <div className="w-100" style={{height: "80%"}}>
                                        <img src={ libro.ImagenLibroBASE64 } className="img-fluid rounded-start" alt="..." />
                                </div>
                                <button className="btn btn-primary btn-sm" id="btnComprar-libro.ISBN13" >Comprar</button>
                            </div>
                            <div className="col-md-8 ps-1">
                                <div className="ms-3">
                                    <h5 className="card-title">{libro.Titulo}</h5>
                                    <h6 className="card-text">{libro.Autores}</h6>
                                    <hr />
                                    <h6>Detalles del libro</h6>
                                    <div className="row">
                                        <div className="col-3">
                                            <div className="card-text text-muted">Editorial</div>
                                            <div className="card-text text-muted">Edición</div>
                                            <div className="card-text text-muted">Páginas</div>
                                            <div className="card-text text-muted">Dimensiones</div>
                                            <div className="card-text text-muted">Idioma</div>
                                            <div className="card-text text-muted">ISBN</div>
                                            <div className="card-text text-muted">ISBN-10</div>
                                        </div>
                                        <div className="col-9 ps-4">
                                            <div className="card-text">{libro.Editorial}</div>
                                            <div className="card-text">{libro.Edicion}</div>
                                            <div className="card-text">{libro.NumeroPaginas} </div>
                                            <div className="card-text">{libro.Dimensiones}</div>
                                            <div className="card-text">{libro.Idioma}</div>
                                            <div className="card-text">{libro.ISBN13}</div>
                                            <div className="card-text">{libro.ISBN10}</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-4 px-0">
                    <div className="bg-light p-3 border border-1">
                        <div className="container bg-white border border-1 p-2">
                            <div className="d-flex flex-row-reverse align-items-end w-100">
                                <h4 className="mx-2">€</h4><h2>{libro.Precio}</h2>
                            </div>
                            <div className="container px-3">
                                <div className="row">
                                    <div className="col-4 border border-2 border-primary d-flex align-items-center justify-content-center"><img src="/images/iconoMiniBan.png" /></div>
                                    <div className="col-8 border border-2 border-primary border-start-0 d-flex flex-column justify-content-center p-2">
                                        <div className="d-flex justify-content-around"><span className="text-primary"><strong>Envío Gratis</strong><i className="fa-solid fa-circle-info mx-2"></i></span> </div>
                                        <div className="d-flex justify-content-around"><span className="text-primary"><small>al comprar este libro</small></span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center py-3 px-1">
                                <button className="btn btn-primary w-100 p-2" id={"btnComprar-" + libro.ISBN13}  style={{borderRadius: "0px"}} onClick={agregarItemPedido}><i className="fa-solid fa-cart-shopping pe-2"></i><strong> Comprar / Recoger</strong></button>
                            </div>
                            <div className="d-flex flex-row justify-content-between px-1">
                                <button className="btn btn-outline-primary p-2 flex-fill" onClick={handleDesplegarListas} style={{ borderRadius: "0px" }}>
                                    <small>Agregar a la lista de deseos</small>
                                </button>

                                <a id="despliega-listas" className="btn btn-outline-primary ms-2 border border-1 border-primary position-relative" style={{ borderRadius: "0px" }}>
                                    <strong>:</strong>
                                    <div className={desplegado ? "position-absolute top-100 start-0" : "position-absolute top-100 start-0 visually-hidden"} id="dropdown-listas" style={{ width: "150px" }}>
                                        <div className="btn btn-outline-primary w-100" onClick={crearNuevaLista} style={{ borderRadius: "0px" }}>Agregar nueva lista</div>
                                        <button type="button" className="btn btn-outline-primary border-top-0 w-100" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style={{ borderRadius: "0px" }}>Ver más listas</button>
                                        <div className="modal fade" id="staticBackdrop" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <ModalListas idLibro={libro._id} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <h4>Resumen</h4>
                <hr />
                <div className="col-8">
                    <p>{libro.Resumen}</p>
                </div>
            </div>
            <Valoracion idLibro={libro._id} />

        </div>
    );
}
export default MostrarLibro;
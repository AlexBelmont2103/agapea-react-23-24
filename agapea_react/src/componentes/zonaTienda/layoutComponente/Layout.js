import { Link, Outlet, useLoaderData, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useClienteLoggedContext } from "../../../contextProviders/clienteLoggedContext";

function Layout() {
  const {clienteLogged} = useClienteLoggedContext();
  console.log("Layout.js - clienteLogged: ", clienteLogged);
  let _listaCategorias = useLoaderData();
  console.log("Layout.js - _listaCategorias: ", _listaCategorias);
  let _location=useLocation();
  console.log("Layout.js - _location: ", _location);
  return (
    <>
        <Header />

        <div className="container">
            <div className="row">
                {/* ----- columna para categorias ------ */}
                <div className="col-3">
                    {
                        ! new RegExp("/Cliente/Panel.*").test(_location.pathname) ? 
                        (
                            <>
                                <h6>Categorias</h6>
                                <div className="list-group">
                                {

                                        _listaCategorias.map(
                                            (cat) => <Link key={cat.IdCategoria} to={"/Tienda/Libros" + cat.IdCategoria} 
                                                        className="list-group-item list-group-item-action">
                                                                {cat.NombreCategoria}
                                                    </Link>
                                        )
                                }
                                </div>                                
                            </>
                        )
                        :
                        (
                            <>
                                <h6 className="text-dark mt-4 ms-3">PANEL PERSONAL DEL CLIENTE</h6>
                                <div className="container">
                                    <div className="row" style={{background:"#ededed"}}>
                                        <div className="col text-center mt-3">
                                            <img src={clienteLogged.datoscliente.cuenta.imagenAvatarBASE64} style={{width:"115px", height:"140px"}} alt="..."/>
                                        </div>
                                    </div>

                                    <div className="row" style={{background:"#ededed"}}>
                                        <div className="col">
                                            <p className="text-muted"><small>Bienvenido {clienteLogged.datoscliente.nombre} {clienteLogged.datoscliente.apellidos} ( {clienteLogged.datoscliente.cuenta.email} )</small></p>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <div className="list-group">
                                                {
                                                    _listaCategorias.map(
                                                        cat => <Link to={`/Cliente/Panel/`+cat.replace(/\s+/g, '')} className="list-group-item list-group-item-action border border-end-0 border-start-0 text-dark">
                                                                    {cat}
                                                                </Link>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>                               
                            </>
                        )
                    }

                </div>

                {/* ------ columna para mostrar en funcion del path, el componente segun REACT-ROUTER ---- */}
                <div className="col-9">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>

        <Footer />
    </>
);
}

export default Layout;
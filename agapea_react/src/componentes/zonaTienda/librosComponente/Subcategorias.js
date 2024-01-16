import { Link, Outlet, useLoaderData } from "react-router-dom";
import Libros from "./Libros";

function Subcategorias(){
    let _listaSubcategorias = useLoaderData();
    return(
        <div>
            <div className="row">
                {
                    _listaSubcategorias.map((subcategoria) => (
                        <div className="col-3">
                            <Link key={subcategoria.IdCategoria} to={`/Tienda/Libros/${subcategoria.IdCategoria}`} >
                                {subcategoria.NombreCategoria}
                            </Link>
                        </div>
                    ))
                }
            </div>
            <div className="row">
                <Libros/>
            </div>
        </div>
    );
}
export default Subcategorias;
import { useLoaderData, Link } from "react-router-dom";
//import { useItemsCarroContext } from "../../../App";
import { useItemsCarroContext } from "../../../contextProviders/itemsCarroContext";

function Libros() {
  //const {itemsCarro, setItemsCarro}=useItemsCarroContext();
  const { itemsCarro, dispatch } = useItemsCarroContext();
  let _listaLibros = useLoaderData(); //<----- recupero libros del loader del componente asociado al path...
  //#region funciones obsoletas
  //Funcion para agregar un item al pedido
  /*function agregarItemPedido(ev){
        ev.preventDefault();
        let _isbn13=ev.target.getAttribute('marcador');
        console.log(_isbn13);
        let _libroEncontrado=_listaLibros.find(
            (item) => {
                return item.ISBN13===_isbn13;
            }
        );
        let _itemEncontrado=itemsCarro.find(
            (item) => {
                return item.libroElemento.ISBN13===_isbn13;
            }
        );
        if(_itemEncontrado===undefined){
            setItemsCarro(
                [
                    ...itemsCarro,
                    {
                        libroElemento: _libroEncontrado,
                        cantidadElemento: 1
                    }
                ]
            );
        }else{
            let _nuevoCarro=itemsCarro.map(
                (item) => {
                    if(item.libroElemento.ISBN13===_isbn13){
                        return {
                            ...item,
                            cantidadElemento: item.cantidadElemento+1
                        }
                    }else{
                        return item;
                    }
                }
            );
            setItemsCarro(_nuevoCarro);
        }
    }
    */
  //#endregion

  //Funcion para manejar el evento click del boton comprar
  function agregarItemPedido(ev) {
    ev.preventDefault();
    let _isbn13 = ev.target.getAttribute("marcador");
    let _libroEncontrado = _listaLibros.find((item) => {
      return item.ISBN13 === _isbn13;
    });
    let _itemEncontrado = itemsCarro.find((item) => {
      return item.libroElemento.ISBN13 === _isbn13;
    });
    if (_itemEncontrado === undefined) {
      dispatch({
        type: "ADD_NUEVO_LIBRO",
        payload: {
          libroElemento: _libroEncontrado,
          cantidadElemento: 1,
        },
      });
    } else{
      dispatch({
        type: "SUMAR_CANTIDAD_LIBRO",
        payload: {
          libroElemento: _libroEncontrado,
          cantidadElemento: 1,
        },
      });
    }
  }

  return (
    <div className="container">
      <div className="row">
        {_listaLibros.map((item) => {
          return (
            <div className="col-4" key={item.ISBN13}>
              <div
                className="mb-3"
                style={{ maxWidth: "540px" }}
                id={"cardLibro-" + item.ISBN13}
              >
                <div className="row g-0">
                  {/*<!-- columna para miniimagen del libro y boton comprar--> */}
                  <div
                    className="col-md-4 text-center"
                    style={{ height: "170px" }}
                  >
                    <div className="w-100" style={{ height: "80%" }}>
                      <Link to={"/Tienda/MostrarLibro" + item.ISBN13}>
                        <img
                          className="img-fluid rounded-start rounded-end"
                          src={item.ImagenLibroBASE64}
                          alt="..."
                        />
                      </Link>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      marcador={item.ISBN13}
                      onClick={agregarItemPedido}
                    >
                      Comprar...
                    </button>
                  </div>

                  {/*<!-- columna para titulo del libro, autores, editorial, pags y precio--> */}
                  <div className="col-md-8">
                    <div className="ms-3">
                      <h6 className="card-title" style={{ height: "50px" }}>
                        <Link
                          to={"/Tienda/MostrarLibro/" + item.ISBN13}
                          className="text-decoration-none"
                        >
                          {item.Titulo}
                        </Link>
                      </h6>
                      <div className="card-text">{item.Autores}</div>
                      <div className="card-text">{item.Editorial}</div>
                      <div className="card-text">
                        <small className="text-muted">
                          {item.NumeroPaginas} páginas
                        </small>
                      </div>
                      <div className="card-text">
                        <strong>{item.Precio} €</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Libros;

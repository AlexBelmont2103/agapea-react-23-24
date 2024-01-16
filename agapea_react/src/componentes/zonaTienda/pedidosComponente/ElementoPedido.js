//componente que representara un elemento del pedido, recibe como propiedad el elemento a pintar del comp.
//padre: Pedido.js <---- recibe del contexto global los elementos del pedido

//import { useItemsCarroContext } from "../../../App"; //<---- del hook de acceso al contexto-global del proveedor de ItemsCarroProvider extraigo la funcion setter
import { useItemsCarroContext } from "../../../contextProviders/itemsCarroContext";
function ElementoPedido({ item }) {
  //#region ----State del componente ----
  //Recuperacion de elementos del pedido del contexto global
  const { itemsCarro, dispatch } = useItemsCarroContext();
  //Recuperación de prop item del componente padre
  let { libroElemento, cantidadElemento } = item;
  //#endregion

  //#region ------------ funciones manejadoras de eventos -----------------------------
  function BotonClickHandler(ev) {
    ev.preventDefault();
    let _isbn13 = ev.target.name.split("-")[1];
    let _itemEncontrado = itemsCarro.find((item) => {
      return item.libroElemento.ISBN13 === _isbn13;
    });
    console.log(_itemEncontrado);
    switch (ev.target.name.split("-")[0]) {
      case "botonEliminar":
        dispatch({
          type: "REMOVE_LIBRO",
          payload: {
            libroElemento: _itemEncontrado.libroElemento,
            cantidadElemento: _itemEncontrado.cantidadElemento,
          },
        });
        break;
      case "botonSumar":
        dispatch({
          type: "SUMAR_CANTIDAD_LIBRO",
          payload: {
            libroElemento: _itemEncontrado.libroElemento,
            cantidadElemento: 1,
          },
        });
        break;
      case "botonRestar":
        if (_itemEncontrado.cantidad > 1) {
          dispatch({
            type: "RESTAR_CANTIDAD_LIBRO",
            payload: {
              libroElemento: _itemEncontrado.libroElemento,
              cantidadElemento: 1,
            },
          });
        } else {
          dispatch({
            type: "REMOVE_LIBRO",
            payload: {
              libroElemento: _itemEncontrado.libroElemento,
            },
          });
        }
        break;
      default:
        break;
    }
  }
  //#endregion ------------------------------------------------------------------------

  return (
    <div className="card mb-3" style={{ maxwidth: "540px" }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={libroElemento.ImagenLibroBASE64}
            className="img-fluid rounded-start"
            alt="..."
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <div className="d-flex flex-row justify-content-between">
              <h5 className="card-title">{libroElemento.Titulo}</h5>
              {/*boton para eliminar libro de elementos pedido*/}
              <button
                className="btn btn-light btn-sm"
                name={"botonEliminar-" + libroElemento.ISBN13}
                onClick={BotonClickHandler}
              >
                {" "}
                X{" "}
              </button>
            </div>

            <div className="d-flex flex-row justify-content-between">
              {/*boton +, label cantidad, boton -  el precio del libro y subtotal elemento pedido*/}
              <button
                className="btn btn-outline-primary btn-sm"
                name={"botonRestar-" + libroElemento.ISBN13}
                onClick={BotonClickHandler}
              >
                {" "}
                -{" "}
              </button>

              <label>
                {" "}
                <small>{cantidadElemento}</small>{" "}
              </label>

              <button
                className="btn btn-outline-primary btn-sm"
                name={"botonSumar-" + libroElemento.ISBN13}
                onClick={BotonClickHandler}
              >
                {" "}
                +{" "}
              </button>

              <label>
                <small>x</small>
                <span style={{ color: "red" }}> {libroElemento.Precio}€ </span>
              </label>
              <label style={{ color: "red" }}>
                {" "}
                {libroElemento.Precio * cantidadElemento}€{" "}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElementoPedido;

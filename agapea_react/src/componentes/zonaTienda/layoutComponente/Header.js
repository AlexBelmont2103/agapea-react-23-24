import { Link } from "react-router-dom";
//import { useClienteLoggedContext, useItemsCarroContext } from "../../../App";
import { useClienteLoggedContext } from "../../../contextProviders/clienteLoggedContext";
import { useItemsCarroContext } from "../../../contextProviders/itemsCarroContext";

function Header() {
  //const {clienteLogged, setClienteLogged}=useClienteLoggedContext();
  //const {itemsCarro, setItemsCarro}=useItemsCarroContext();
  const { clienteLogged, dispatch } = useClienteLoggedContext();
  const { itemsCarro } = useItemsCarroContext();
  //funcion para calcular el total del carro
  function calcularTotalCarro() {
    let _total = 0;
    itemsCarro.map((item) => {
      let _subtotal = item.libroElemento.Precio * item.cantidadElemento;
      _total += _subtotal;
    });
    return _total.toFixed(2);
  }
  return (
    <header>
      <div className="container-lg m-0 p-0">
        <div className="col-12 vw-100">
          <div className="row m-0 p-0" style={{ backgroundColor: "#2c2c2c" }}>
            <div className="col-9"></div>
            <div className="col-3">
              <div className="btn-group btn-sm">
                <a href="#" className="btn btn-dark btn-sm">
                  <img src="/images/botonMINIContacto.png" />
                </a>
                {clienteLogged != null && (
                  <Link
                    to="/Cliente/Panel"
                    className="btn btn-dark btn-sm"
                  >
                    {clienteLogged.datoscliente.cuenta.email}
                  </Link>
                )}
                {clienteLogged == null && (
                  <Link to="/Cliente/Login" className="btn btn-dark btn-sm">
                    <img src="/images/botonMINIlogin.png" />
                  </Link>
                )}
              </div>
            </div>
          </div>
          <nav className="row bg-light vw-100 m-0 border border-bottom-2">
            <div className="row p-3 container me-0 ms-5">
              {/*<!-- Mi cuenta --> */}
              <div className="col-4 d-flex align-content-center justify-content-center ps-5">
                <Link to="/" className="p-2">
                  <img
                    src="/images/agapea-logo.png"
                    alt=""
                    width="auto"
                    height="40"
                  />
                </Link>
              </div>
              <div className="col-4">
                <form>
                  <div className="bg-gray border border-5 border w-75 h-100 d-flex flex-row">
                    <div className="p-1 flex-fill">
                      <input
                        className="border-0 w-100 h-100"
                        type="text"
                        name="cajatext"
                        placeholder="Buscar por libro, autor, ISBN..."
                      />
                    </div>
                    <div className="bg-primary p-2 border border-5 border-end-0 border-top-0 border-bottom-0">
                      <a
                        id="botonBuscar"
                        onClick={() => document.forms[0].submit()}
                      >
                        <img src="" width="auto" height="20" />
                      </a>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-4 p-0">
                <div className="w-50 h-100">
                  {/* <!-- mini carrito --> */}
                  <Link
                    to="/Pedido/MostrarPedido"
                    className="h-100 bg-white border border-dark border-1 btn btn-light"
                  >
                    <img src="/images/boton_mini_carrito.png" alt="" />
                    <span className="text-dark badge badge-danger  ps-1 pe-1">
                      {" "}
                      <small>Total:</small>{" "}
                      <span
                        className="text-end"
                        id="precioCarrito"
                        style={{ width: "110px", fontSize: "1.2em" }}
                      >
                        {calcularTotalCarro()} €
                      </span>
                    </span>
                    <img className="align-content-lg-center" src="" alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

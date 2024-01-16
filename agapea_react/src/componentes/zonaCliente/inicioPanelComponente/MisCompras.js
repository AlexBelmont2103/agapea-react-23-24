import React from "react";
import { useClienteLoggedContext } from "../../../contextProviders/clienteLoggedContext";

function MisCompras() {
  //#region state manejado por el componente tanto globla como local
  const { clienteLogged, dispatch } = useClienteLoggedContext();
  // #endregion
  return (
    /* Recuperamos datos de los pedidos y los mostramos en un card */
    <div className="container">
      {clienteLogged.datoscliente.pedidos.map((pedido) => (
        <div className="card" key={pedido._id}>
          <div className="card-body">
            <h5 className="card-title">Pedido: {pedido._id}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              Fecha: {pedido.fechaPedido}
            </h6>
            <p className="card-text">Total: {pedido.totalPedido}€</p>
            <p className="card-text">Estado: {pedido.estadoPedido}</p>
            <p className="card-text">Productos: </p>
            <div
              className="alert alert-secondary"
              data-bs-toggle="collapse"
              href="#collapseDatos"
            >
              Productos
            </div>
            <div className="collapse" id="collapseDatos">
              {pedido.elementosPedido.map((producto) => (
                <div key={producto._id}>
                  <img src={producto.libroElemento.ImagenLibroBASE64}></img>
                  <p>Titulo: {producto.libroElemento.Titulo}</p>
                  <p>Cantidad: {producto.cantidadElemento}</p>
                  <p>Precio: {producto.libroElemento.Precio}€</p>
                </div>
              ))}
            </div>
            <div></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MisCompras;

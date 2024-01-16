import { useState, useEffect } from "react";
import tiendaRESTService from "../../../servicios/restTienda";
import clienteRESTService from "../../../servicios/restCliente";
import { useClienteLoggedContext } from "../../../contextProviders/clienteLoggedContext";

export default function Valoracion({ idLibro }) {
  const [valoraciones, setValoraciones] = useState([]);
  const { clienteLogged, dispatch } = useClienteLoggedContext();
  const [comentario, setComentario] = useState("");
  //Efecto para cargar los comentarios del libro
    useEffect(() => {
        async function peticionComentarios() {
            console.log("id libro...", idLibro);
            let _comentarios = await tiendaRESTService.recuperarComentarios(idLibro);
            console.log("comentarios...", _comentarios);
            setValoraciones(_comentarios);
        }
        peticionComentarios();
    }, [idLibro]);

  async function HandleChange(ev) {
    const dataValue = ev.target.getAttribute("data-value");
    console.log("dataValue...", dataValue);
    //Construimos objeto de datos a enviar al servicio REST
    let _datos = {
        nombreUsuario: clienteLogged.datoscliente.cuenta.login,
        idLibro: idLibro,
        valoracion: dataValue,};
        console.log('datos a enviar...', _datos);
    // añadimos comentario a la bd
    //Recuerda mandar el jwt en el header de la peticion
    let _resp = await tiendaRESTService.enviarComentario(_datos, clienteLogged.tokensesion);
    if(_resp.codigo===0){
        console.log("resp...", _resp);
        //Recuperamos el cliente actualizado y lo guardamos en el contexto
        let clienteActualizado = _resp.datoscliente;
        let tokensesion = _resp.tokensesion;
        dispatch({
            type: "LOGIN",
            payload: {
                datoscliente: clienteActualizado,
                tokensesion: tokensesion,
            },
            });
        //Abrimos ventana modal por si el cliente quiere añadirle un comentario a su valoracion
        window.prompt("Añade un comentario a tu valoracion");
        //recogemos el comentario y el id del comentario para actualizarlo en la bd
        let _comentario = window.prompt("Añade un comentario a tu valoracion");
        let _idComentario = _resp.otrodatos;
        let _datosEditar = {
            idComentario: _idComentario,
            comentario: _comentario,
        };
        //Hacemos nueva petición al servicio REST para editar el comentario
        let _respEditar = await tiendaRESTService.editarComentario(_datosEditar, clienteLogged.tokensesion);
        if (_respEditar.codigo === 0) {
            console.log("resp...", _respEditar);
            //Recuperamos el cliente actualizado y lo guardamos en el contexto
            let clienteActualizado = _respEditar.datoscliente;
            let tokensesion = _respEditar.tokensesion;
            dispatch({
                type: "LOGIN",
                payload: {
                    datoscliente: clienteActualizado,
                    tokensesion: tokensesion,
                },
            });

        }
    }
  }

  if (valoraciones.length === 0) {
    return (
      <>
        <h4 className="border-bottom d-flex justify-content-center">
          Danos tu valoracion de este libro
        </h4>
        <form>
          <div class="rating d-flex justify-content-center border-bottom">
            <input
              type="radio"
              id={"star5"}
              name="rating"
              htmlFor={"star5"}
              data-value="5"
              onChange={HandleChange}
            />
            <label for="star5" class="star" value="5" data-value="5"></label>
            <input
              type="radio"
              id={"star4"}
              name="rating"
              htmlFor={"star4"}
              data-value="4"
              onChange={HandleChange}
            />
            <label for="star4" class="star" data-value="4"></label>
            <input
              type="radio"
              id={"star3"}
              name="rating"
              htmlFor={"star3"}
              data-value="3"
              onChange={HandleChange}
            />
            <label for="star3" class="star" data-value="3"></label>
            <input
              type="radio"
              id={"star2"}
              name="rating"
              htmlFor={"star2"}
              data-value="2"
              onChange={HandleChange}
            />
            <label for="star2" class="star" data-value="2"></label>
            <input
              type="radio"
              id={"star1"}
              name="rating"
              htmlFor={"star1"}
              data-value="1"
              onChange={HandleChange}
            />
            <label for="star1" class="star" data-value="1"></label>
          </div>
          <div id="result"></div>
        </form>
      </>
    );
  } else {
    return (
      <>
        <div className="container-fluid">
          <div className="d-flex flex-column justify-content-between">
            <h4 className="border-bottom d-flex justify-content-center">
              Danos tu valoracion de este libro
            </h4>
            <form>
              <div class="rating d-flex justify-content-center border-bottom">
                <input
                  type="radio"
                  id={"star5"}
                  name="rating"
                  htmlFor={"star5"}
                  data-value="5"
                  onChange={HandleChange}
                />
                <label
                  for="star5"
                  class="star"
                  value="5"
                  data-value="5"
                ></label>
                <input
                  type="radio"
                  id={"star4"}
                  name="rating"
                  htmlFor={"star4"}
                  data-value="4"
                  onChange={HandleChange}
                />
                <label for="star4" class="star" data-value="4"></label>
                <input
                  type="radio"
                  id={"star3"}
                  name="rating"
                  htmlFor={"star3"}
                  data-value="3"
                  onChange={HandleChange}
                />
                <label for="star3" class="star" data-value="3"></label>
                <input
                  type="radio"
                  id={"star2"}
                  name="rating"
                  htmlFor={"star2"}
                  data-value="2"
                  onChange={HandleChange}
                />
                <label for="star2" class="star" data-value="2"></label>
                <input
                  type="radio"
                  id={"star1"}
                  name="rating"
                  htmlFor={"star1"}
                  data-value="1"
                  onChange={HandleChange}
                />
                <label for="star1" class="star" data-value="1"></label>
              </div>
              <div id="result"></div>
            </form>
            {valoraciones.map((valoracion) => {
              return (
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column">
                    <p>{valoracion.nombreUsuario}</p>
                    <p className="">
                      {[...Array(valoracion.valoracion).keys()].map((i) => {
                        return (
                          <img
                            src="/images/star-empty.png"
                            style={{ height: "auto", width: "1rem" }}
                          />
                        );
                      })}
                    </p>
                    <p>{valoracion.comentario}</p>
                  </div>
                </div>
              );
            })}
            <button></button>
          </div>
        </div>
      </>
    );
  }
}

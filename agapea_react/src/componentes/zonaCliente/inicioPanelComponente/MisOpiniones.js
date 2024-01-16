import {useState} from "react";
import { useClienteLoggedContext } from "../../../contextProviders/clienteLoggedContext";
import tiendaRESTService from "../../../servicios/restTienda";
function MisOpiniones() {
  //#region state manejado por el componente tanto globla como local
  const { clienteLogged, dispatch } = useClienteLoggedContext();
  const [comentario, setComentario] = useState("");
  // #endregion

  // #region funciones manejadoras de eventos
  async function handleSubmit(ev) {
    ev.preventDefault();
    console.log("submit...", ev.target.id);
    //Nos aseguramos de que el comentario tiene el value actualizado al texto del textarea
    setComentario(ev.target.value);
    //Construimos objeto de datos a enviar al servicio REST
    let _datos = {
      idComentario: ev.target.id,
      comentario: comentario,
    };
    console.log("datos a enviar...", _datos);
    let _respEditar = await tiendaRESTService.editarComentario(
      _datos,
      clienteLogged.tokensesion
    );
    console.log("resp...", _respEditar);

  }
  function handleChange(ev) {
    setComentario(ev.target.value);
  }
  // #endregion
  return (
    <div className="container">
      {clienteLogged.datoscliente.comentarios.map((comentario) => (
        <form>
          <div className="card" key={comentario._id}>
            <div className="card-body">
              <img src={comentario.idLibro.ImagenLibroBASE64}></img>
              <p>Titulo: {comentario.idLibro.Titulo}</p>
              <textarea
                className="form-control"
                id="comentario"
                rows="3"
                value={comentario.comentario}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="card-footer">
              <input
                id={comentario._id}
                type="submit"
                className="btn btn-primary"
                value="Modificar comentario"
                onClick={handleSubmit}
              />
              <input
                type="submit"
                className="btn btn-danger"
                value="Eliminar comentario"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </form>
      ))}
    </div>
  );
}

export default MisOpiniones;

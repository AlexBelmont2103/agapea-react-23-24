import { useState } from "react";
import { useClienteLoggedContext } from "../../../contextProviders/clienteLoggedContext";
import FormField from "../../../UIComponents/FormField";
import { LoginCliente } from "../../../servicios/restCliente";
import { Link, useNavigate } from "react-router-dom";


function Login() {
  const {dispatch}= useClienteLoggedContext();
  const navigate= useNavigate(); // hook de react-router-dom que devuelve una funcion navigate('path_salto) que actúa como un componente Navigate
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  function HandlerChangeEvents(name, value) {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  async function SubmitForm(ev) {
    //Se envían los datos del formData a la BD para comprobar que existe el usuario y su contraseña coincide
    ev.preventDefault();
    try{
      var _respuestaServer = await LoginCliente(formData);
      console.log('Respuesta del server ante el envío de datos...',_respuestaServer);
      dispatch({type:"CLIENTE_LOGIN", payload:{datoscliente:_respuestaServer.datoscliente, tokensesion:_respuestaServer.tokensesion}});
      //setClienteLogged({datoscliente:_respuestaServer.datoscliente, tokensesion:_respuestaServer.tokensesion});
      navigate('/');
      
    }catch(error){
      console.log(error);
    }
  }


  return (
    <div className="container">
      <div className="row">
          <div className="col-7 pt-3">
            <h2>Registrate en <strong>agapea.com</strong></h2>
            <p>
                Regístrate en
                agapea.com
                y disfruta de todos sus beneficios y comodidades.
            </p>
            <div className="m-4">
                <Link className="btn btn-primary btn-lg" to='/Cliente/registro'>Registrate</Link>
            </div>
          </div>
        <div className="col-5 bg-light p-4 border">
          <form className="row g-3" onSubmit={SubmitForm}>
            {[
              {
                id: "email",
                value: formData.email,
                type: "email",
                name: "email",
                label: "Correo electrónico",
                placeholder:"mio@mio.es",
                validators: {
                  required: [true, "email obligatorio"],
                  pattern: [
                    "^.*@.*\\.[a-z]{2,3}$",
                    "* Formato de Email invalido",
                  ],
                }
              },
              {
                id: "password",
                value: formData.password,
                type: "password",
                name: "password",
                label: "Contraseña",
                validators: {
                  required: [true, "* Contraseña es obligatoria"],
                  pattern: [
                    "^(?=.*\\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{8,}$",
                    "* la contraseña debe contener MAYS,MINS, digito y otro caracter",
                  ],
                  minlength: [
                    8,
                    "* la contraseña debe tener al menos 8 caracteres",
                  ],
                },
              },
            ].map((elemento) => (
              <div className="col-6 p-3 text-secondary" key={elemento.name}>
                <FormField
                  id={elemento.id}
                  type={elemento.type}
                  value={elemento.value}
                  name={elemento.name}
                  label={elemento.label}
                  validators={elemento.validators}
                  onChangeInParent={HandlerChangeEvents}
                ></FormField>
              </div>
            ))}
            <div className="col-12">
              <button type="submit" className="btn btn-primary btn-lg">
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;

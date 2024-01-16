import { useState } from "react";
import FormField from "../../../UIComponents/FormField";
import { RegistrarCliente } from "../../../servicios/restCliente";
function Registro3() {
  //establecer en el state del componente un objeto q tenga como propiedades el nombre de los campos
  //del formulario

  const [formData, setFormData] = useState({
    email: "",
    repemail: "",
    password: "",
    repassword: "",
    nombre: "",
    apellidos: "",
    login: "",
    telefono: "",
  });
  
  async function SubmitForm(ev) {
    ev.preventDefault(); 
    var cli={
      nombre:formData.nombre,
      apellidos:formData.apellidos,
      email:formData.email,
      password:formData.password,
      login:formData.login,
      telefono:formData.telefono
    }
    try{
      var _respuestaServer =await RegistrarCliente(cli);
      console.log('Respuesta del server ante el registro de datos...',_respuestaServer);
    }catch(error){
      console.log(error);
    }
  }

  //Funcion que realiza el subir-up-state en componentes hijos
  //Modificar el stateFormData desde el FormField
  //Tiene que pasar como argumentos el name del input y su value
  //1º: Definir función que modifica el state en el componente padre
  //2º: Pasar como prop la función
  //3º: En comp hijos ante un evento que se produzca en los mismos, se invoca a la función
  function HandlerChangeEvents(name, value) {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>
            <strong>Registrate en Agapea.com</strong>
          </h2>
          <p>
            Tienes tres opciones para registrarte en agapea.com. Tienes tres
            opciones para registrarte en agapea.com. y disfrutar de nuestros
            servicios y ventajas.{" "}
          </p>
          <p>
            Puedes hacerlo a través de las redes sociales en 4 segundos. O
            registrarte con nosotros, no tardarás más de 40 segundos en hacerlo.
            Solo tendrás que rellenar el siguiente formulario con tus datos.{" "}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <p>
            Registro con{" "}
            <img
              src="/images/agapea-logo.svg"
              width="186px"
              height="85px"
              alt=""
            />
          </p>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col">
          <form className="row g-3" onSubmit={SubmitForm}>
            {
              //Array de cajas del formulario de registro.
              //Creamos un componente FormField por cada caja
              [
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
                  },
                },
                {
                  id: "repemail",
                  value: formData.repemail,
                  type: "email",
                  name: "repemail",
                  label: "Repite el correo electrónico",
                  placeholder:"mio@mio.es",
                  validators: {
                    required: [true, "email obligatorio"],
                    pattern: [
                      "^.*@.*\\.[a-z]{2,3}$",
                      "* Formato de Email invalido",
                    ],
                    compareto: ["email", "* los emails deben coincidir"],
                  },
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
                {
                  id: "repassword",
                  value: formData.repassword,
                  type: "password",
                  name: "repassword",
                  label: "Repite la contraseña",
                  validators: {
                    required: [true, "* Repetir Contraseña es obligatorio"],
                    pattern: [
                      "^(?=.*\\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\\S{8,}$",
                      "* la contraseña debe contener MAYS,MINS, digito y otro caracter",
                    ],
                    minlength: [
                      8,
                      "* la contraseña debe tener al menos 8 caracteres",
                    ],
                    compareto: [
                      "password",
                      "* las contraseñas deben coincidir",
                    ],
                  },
                },
                {
                  id: "nombre",
                  value: formData.nombre,
                  type: "text",
                  name: "nombre",
                  label: "Nombre",
                  placeholder:"Biggs",
                  validators: {
                    required: [true, "* Nombre es obligatorio"],
                    pattern: [
                      "^[a-zA-Z\\s]{3,}$",
                      "* solo se admiten letras en el nombre",
                    ],
                    minlength: [
                      3,
                      "* el nombre debe contener al menos 3 caracteres",
                    ],
                    maxlength: [
                      50,
                      "* el nombre no puede superar los 50 caracteres",
                    ],
                  },
                },
                {
                  id: "apellidos",
                  value: formData.apellidos,
                  type: "text",
                  name: "apellidos",
                  label: "Apellidos",
                  placeholder:"Darklighter",
                  validators: {
                    required: [true, "* Apellidos es obligatorio"],
                    pattern: [
                      "^[a-zA-Z\\s]{3,}$",
                      "* solo se admiten letras en los apellidos",
                    ],
                    minlength: [
                      3,
                      "* los apellidos debe contener al menos 3 caracteres",
                    ],
                    maxlength: [
                      100,
                      "* los apellidos no puede superar los 100 caracteres",
                    ],
                  },
                },
                {
                  id: "login",
                  value: formData.login,
                  type: "text",
                  name: "login",
                  label: "Nombre de usuario",
                  validators: {
                    pattern: [
                      "^(?=.*\\d)?(?=.*[\u0021-\u002b\u003c-\u0040])?(?=.*[A-Z])?(?=.*[a-z])\\S{3,}$",
                      "* formato de login incorrecto, al menos 3 letras MINS",
                    ],
                    minlength: [
                      3,
                      "* el login debe contener al menos 3 caracteres",
                    ],
                  },
                },
                {
                  id: "telefono",
                  value: formData.telefono,
                  type: "text",
                  name: "telefono",
                  label: "Teléfono (opcional)",
                  placeholder:"666 11 22 33",
                  validators: {
                    pattern: [
                      "^\\d{3}\\s?(\\d{2}\\s?){2}\\d{2}$",
                      "* formato de telefono incorrecto: 111 22 33 44",
                    ],
                  },
                },
              ].map((el) => (
                <div className="col-6 p-3 text-secondary" key={el.name}>
                <FormField
                  id={el.id}
                  type={el.type}
                  value={el.value}
                  name={el.name}
                  label={el.label}
                  validators={el.validators}
                  onChangeInParent={HandlerChangeEvents}
                ></FormField>
                </div>

              ))
            }

            <p>
              <small className="text-mutted">
                Agapea S.A se compromete a garantizar la seguridad de tus datos
                y a guardarlos en la más estricta confidencialidad.
              </small>
            </p>
            <hr></hr>

            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="checkInfo"
                ></input>
                <label className="form-check-label" htmlFor="checkInfo">
                  Deseo recibir información sobre libros, novedades y eventos de
                  Agapea.com o sus librerías.
                </label>
              </div>
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="checkCondiciones"
                  name="condUso"
                  value="true"
                  defaultChecked
                ></input>
                <label className="form-check-label" htmlFor="checkCondiciones">
                  Acepto las condiciones de uso y nuestra politica de cookies.
                </label>
              </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary btn-lg">
                REGISTRAME
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registro3;

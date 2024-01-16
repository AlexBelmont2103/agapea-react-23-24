import { useState } from "react";

function Registro() {
  const [formData, setFormData] = useState({
    email: "",
    repemail: "",
    password: "",
    repassword: "",
    nombre: "",
    apellidos: "",
    nick: "",
    telf: "",
  });

  function HandlerChangeEvents(ev) {
    setFormData({
      ...formData,
      [ev.target.name]: ev.target.value,
    });
  }

  function comprobarEmail() {
    const plantillaEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const email = formData.email;
    const repemail = formData.repemail;
    if (
      plantillaEmail.test(email) &&
      plantillaEmail.test(repemail) &&
      email === repemail
    ) {
      return true;
    } else {
      alert("email no validado");
    }
  }

  function comprobarPass() {
    const plantillaPass = /^[a-zA-Z0-9!@#$%^&*]{6,}$/;

    if (
      plantillaPass.test(formData.password) &&
      plantillaPass.test(formData.password) &&
      formData.password === formData.repassword
    ) {
      return true;
    } else {
      alert("contraseña no validada");
    }
  }

  function comprobarNomApe() {
    const plantillaNomApe = /^[\w \s À-ÿ\u00f1\u00d1]{3,100}$/;

    if (
      plantillaNomApe.test(formData.nombre) &&
      plantillaNomApe.test(formData.apellidos)
    ) {
      return true;
    } else {
      alert("Nombre y apellidos no validados");

      return false;
    }
  }

  function comprobarNick() {
    const plantillaNick = /.{3,}/;
    if (!plantillaNick.test(formData.nick)) {
      alert("Nick no permitido. Se utilizará como nick la cuenta de email");
      formData.nick = formData.email;
    }
  }

  function submitForm(ev) {
    ev.preventDefault();

    if (comprobarEmail() && comprobarPass() && comprobarNomApe()) {
      comprobarNick();
      console.log(formData);
    }
  }

  return (
    <div className="container p-5 border w-auto">
      <h1>Regístrate en agapea.com</h1>
      <p>
        Tienes tres opciones para registrarte en <strong>agapea.com</strong>y
        disfrutar de nuestros servicios y ventajas.
      </p>
      <p>
        Puedes hacerlo a través de las redes sociales en
        <strong> 4 segundos</strong>. O registrarte con nosotros, no tardarás
        más de <strong>40 segundos</strong> en hacerlo. Solo tendrás que
        rellenar el siguiente formulario con tus datos.
      </p>
      <form className="row col-12" method="post" onSubmit={submitForm}>
        <legend className="text-center col-12 ">Registro con agapea.com</legend>
        <div className="col-6 p-3 text-secondary">
          <label for="email" className="form-label">
            Correo electrónico
          </label>
          <br></br>
          <input
            className="w-100 form-control bg-dark-subtle"
            id="email"
            name="email"
            type="text"
            value={formData.email}
            placeholder="Email"
            onChange={HandlerChangeEvents}
          />
        </div>
        <div className="col-6 p-3 text-secondary">
          <label for="repemail" className="form-label">
            Repetir correo electrónico
          </label>
          <br></br>
          <input
            className="w-100 form-control bg-dark-subtle"
            id="repemail"
            name="repemail"
            type="text"
            value={formData.repemail}
            placeholder="Repite el email"
            onChange={HandlerChangeEvents}
          />
        </div>
        <div className="col-6 p-3 text-secondary">
          <label for="password" className="form-label">
            Contraseña
          </label>
          <br></br>
          <input
            className="w-100 form-control bg-dark-subtle"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={HandlerChangeEvents}
          />
        </div>
        <div className="col-6 p-3 text-secondary">
          <label for="repassword" className="form-label">
            Repetir contraseña
          </label>
          <br></br>
          <input
            className="w-100 form-control bg-dark-subtle"
            id="repassword"
            name="repassword"
            type="password"
            value={formData.repassword}
            onChange={HandlerChangeEvents}
          ></input>
        </div>
        <div className="col-6 p-3 text-secondary">
          <label for="nombre" className="form-label">
            Nombre
          </label>
          <br></br>
          <input
            className="w-100 form-control bg-dark-subtle"
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            placeholder="Nombre"
            onChange={HandlerChangeEvents}
          ></input>
        </div>
        <div className="col-6 p-3 text-secondary">
          <label for="apellidos" className="form-label">
            Apellidos
          </label>
          <br></br>
          <input
            className="w-100 form-control bg-dark-subtle"
            id="apellidos"
            name="apellidos"
            type="text"
            value={formData.apellidos}
            placeholder="Apellidos"
            onChange={HandlerChangeEvents}
          ></input>
        </div>
        <div className="col-6 p-3 text-secondary">
          <label for="nick" className="form-label">
            Usuario
          </label>
          <br></br>
          <input
            className="w-100 form-control bg-dark-subtle"
            id="nick"
            name="nick"
            type="text"
            placeholder="Usuario"
            value={formData.nick}
            onChange={HandlerChangeEvents}
          ></input>
        </div>
        <div className="col-6 p-3 text-secondary">
          <label for="telefono" className="form-label">
            Teléfono <i>(opcional)</i>
          </label>
          <br></br>
          <input
            className="w-100 form-control bg-dark-subtle"
            id="telefono"
            name="telefono"
            type="text"
            placeholder="Teléfono (opcional)"
            value={formData.telf}
            onChange={HandlerChangeEvents}
          ></input>
        </div>
        <span className="text-secondary">
          Agapea S.A se compromete a garantizar la seguridad de tus datos y a
          guardarlos en la más estricta confidencialidad.
        </span>
        <hr className="m-3 w-100"></hr>
        <div className="col-12 text-secondary">
          <label for="recibirNovedades" className="check checklink">
            {" "}
            <input
              type="checkbox"
              id="recibirNovedades"
              name="recibirNovedades"
              value="1"
            />{" "}
            <span className="checkmark"></span>
            Deseo recibir información sobre libros, novedades y eventos de
            Agapea.com o sus librerías.
          </label>
          <label for="condiciones" className="check checklink">
            {" "}
            <input
              type="checkbox"
              id="condiciones"
              name="condiciones"
              value="1"
              required=""
            />{" "}
            <span className="checkmark"></span> Acepto las{" "}
            <a
              href="https://www.agapea.com/condiciones-de-contratacion.php"
              title="Condiciones de uso"
            >
              Condiciones de uso
            </a>
            , y nuestra{" "}
            <a
              href="https://www.agapea.com/politica-cookies-rgpd.php"
              title="Política de Cookies"
            >
              política de Cookies
            </a>
          </label>
        </div>
        <div className="col-12 text-secondary"></div>
        <hr className="m-3 w-100"></hr>
        <p className="text-secondary">
          En cumplimiento de los establecido en la legislación vigente en
          materia de protección de datos de carácter personal, Agapea Factory
          S.A. le informa que los datos recogidos a través de este formulario
          serán tratados con la finalidad de gestión de usuarios de nuestra
          página web y si lo autoriza mediante la casilla correspondiente, el
          envío de información sobre libros, novedades y eventos organizados por
          Agapea o por sus librerías, siendo por tanto la legitimación para el
          tratamiento de los datos personales la ejecución del presente contrato
          y su consentimiento para la recepción de información. Así mismo le
          informamos que los datos recogidos no se cederán datos a terceros
          salvo obligación legal y que podrá ejercer los derechos de acceso,
          rectificación, cancelación u oposición, así como los derechos
          adicionales que le asisten a través de la dirección de email
          librosurgentes@agapea.com, así como a través de los medios detallados
          en la información adicional sobre nuestra política de privacidad que
          puede consultar en la dirección web
          https://www.agapea.com/politica-cookies-rgpd.php
        </p>
        <button type="submit" className="btn btn-primary col-2">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Registro;

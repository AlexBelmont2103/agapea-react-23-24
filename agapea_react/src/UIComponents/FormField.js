//Este componente representa cualquier caja de tipo input
//Se le deben pasar como propiedades el tipo (type, id, value, name, placeholder, validators, label, onchangeinparent)
//onchangeinparent es un puntero a la función del componente padre que quiero que se dispare ante un evento
//en el componente hijo para modificar el valor del state en el comp padre
//De padre a hijo: con props
//De hijo a padre: con funciones

import { useState } from "react";

function FormField({
  id,
  label,
  name,
  placeholder,
  type,
  value,
  validators,
  onChangeInParent,
}) {
  //Variable state interna del componente que se mapea contra el input
  //Controla errores de validación...
  const [errorField, setErrorField] = useState("");
  //Se cambiará en el evento Onblur
  function HandlerOnBlurEvents(ev) {
    const { value, name } = ev.target;
    if (name === "login" && value.trim() === "") return;

    let _validField = true;

    Object.keys(validators).forEach((validator) => {
      switch (validator) {
        case "required":
          _validField = value.trim() !== "";
          break;

        case "pattern":
          _validField = new RegExp(validators[validator][0]).test(value);
          break;

        case "minlength":
          _validField = value.length >= validators[validator][0];
          break;

        case "maxlength":
          _validField = value.length < validators[validator][0];
          break;

        case "compareto":
          let _campoacomparar = validators[validator][0];
          //_validField=value === validators[_campoacomparar].value;
          _validField =
            value === document.getElementsByName(_campoacomparar).value;
          break;

        default:
          break;
      }

      if (!_validField) {
        setErrorField(validators[validator][1]);
      } else {
        setErrorField("");
      }
    });
  }

  function HandlerChangeEvent(ev) {
    let { name, value } = ev.target;
    onChangeInParent(name, value);
  }

  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type={type}
        className="w-100 form-control bg-dark-subtle"
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onBlur={HandlerOnBlurEvents}
        //OJO AL PASAR EVENTO
        onChange={HandlerChangeEvent}
      ></input>
      {errorField && <span className="text-danger">{errorField}</span>}
    </div>
  );
}

export default FormField;

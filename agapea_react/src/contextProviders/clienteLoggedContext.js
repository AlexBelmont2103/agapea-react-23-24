//modulo js para definir el state global con context-api del cliente logueado
//usando un reducer, no el state
import { createContext, useContext, useReducer } from "react";

const clienteLoggedContext = createContext();
//Funcion reducer
//Requisitos: 2 parametros: 
//El state actual
//La action que se manda debe ser un objeto json con propiedad type y payload con el valor que quieres cambiar
// {type:"nombreAccion", payload: valor}
//La funcion debe ser pura: no debe modificar el state original, debe devolver un nuevo state
function clienteLoggedReducer(state, action) {
    //en action.payload un objeto asi: {datoscliente:..., jwt:...}
    console.log("payload recibido en reducer: ",action.payload);
    switch (action.type) {
      case "CLIENTE_LOGIN":
      case "CLIENTE_UPDATE":
      case "CLIENTE_RECUPERAR":
          return {
              ...state,
              datoscliente: action.payload.datoscliente,
              tokensesion: action.payload.tokensesion
          };
      case "CLIENTE_LOGOUT":
          return null;
      default:
          return state;
  }
    }


//A EXPORTAR: componente con codigo jsx que defina el provider del contexto y pase valores del reducer
function ClienteLoggedProvider({ children }) {
  const [clienteLogged, dispatch] = useReducer(clienteLoggedReducer, null);
  return (
    <clienteLoggedContext.Provider value={{ clienteLogged, dispatch }}>
      {children}
    </clienteLoggedContext.Provider>
  );
}

//A EXPORTAR: Hook personalizado para usar los valores del contexto creado
function useClienteLoggedContext() {
  const value = useContext(clienteLoggedContext);
  return value;
}

export { ClienteLoggedProvider, useClienteLoggedContext };

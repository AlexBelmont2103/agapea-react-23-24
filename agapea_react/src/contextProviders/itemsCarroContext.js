//modulo js para definir el state global con context-api del carro
//usando un reducer, no el state
import { createContext, useContext, useReducer } from "react";

const itemsCarroContext = createContext();
//Funcion reducer
//Requisitos: 2 parametros:
//El state actual
//La action que se manda debe ser un objeto json con propiedad type y payload con el valor que quieres cambiar
// {type:"nombreAccion", payload: valor}
//La funcion debe ser pura: no debe modificar el state original, debe devolver un nuevo state
function itemsCarroReducer(state, action) {
  //en action.payload un objeto asi: {libroElemento:{...}, cantidadElemento:...}
  console.log(action);
  console.log(state);
  switch (action.type) {
    case "ADD_NUEVO_LIBRO":
      return [...state, action.payload];
    case "SUMAR_CANTIDAD_LIBRO":
      return state.map((item) => {
        if (item.libroElemento.ISBN13 === action.payload.libroElemento.ISBN13) {
          return { ...item, cantidadElemento: item.cantidadElemento + action.payload.cantidadElemento };
        } else {
          return item;
        }
      });
    case "REMOVE_LIBRO":
        return state.filter((item) => item.libroElemento.ISBN13 !== action.payload.libroElemento.ISBN13);
    case "RESTAR_CANTIDAD_LIBRO":
        return state.map((item) => {
            if (item.libroElemento.ISBN13 === action.payload.libroElemento.ISBN13) {
            return { ...item, cantidadElemento: item.cantidad - action.payload.cantidadElemento };
            } else {
            return item;
            }
        });
    case "VACIAR_CARRITO":
        return [];  
    default:
      return state;  
  }
}

//A EXPORTAR: componente con codigo jsx que defina el provider del contexto y pase valores del reducer
function ItemsCarroProvider({ children }) {
  const [itemsCarro, dispatch] = useReducer(itemsCarroReducer, []);
  return (
    <itemsCarroContext.Provider value={{ itemsCarro, dispatch }}>
      {children}
    </itemsCarroContext.Provider>
  );
}

//A EXPORTAR: Hook personalizado para usar los valores del contexto creado
function useItemsCarroContext() {
  const value = useContext(itemsCarroContext);
  return value;
}

export { ItemsCarroProvider, useItemsCarroContext };

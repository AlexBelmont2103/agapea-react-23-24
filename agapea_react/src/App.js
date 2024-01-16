
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Login from "./componentes/zonaCliente/loginComponente/Login";
import Registro3 from "./componentes/zonaCliente/registroComponente/Registro3"
import Layout from "./componentes/zonaTienda/layoutComponente/Layout";
import Libros from "./componentes/zonaTienda/librosComponente/Libros";
import MostrarLibro from "./componentes/zonaTienda/librosComponente/MostrarLibro";
import tiendaRESTService from "./servicios/restTienda";
import MostrarPedido from "./componentes/zonaTienda/pedidosComponente/MostrarPedido";
import pedidoRESTService from "./servicios/restPedido";

//-----------------------------------------------------------------
//Array de objetos Route creados con CreateBrowserRouter
//Pasar al proveedor de rutas RouterProvider

const routerObjects= createBrowserRouter(
  [
    {
      element: <Layout/>,
      loader: tiendaRESTService.recuperarCategorias,//Funcion async que se ejecuta de forma paralela
      children:
      [
        {path:"/", element:<Navigate to="Tienda/Libros/" />},
        {path:"/Tienda/Libros/:idcategoria?", element: <Libros/>, loader: tiendaRESTService.recuperarLibros},
        {path:"Tienda/MostrarLibro/:isbn13", element: <MostrarLibro/>}, //En vez de usar un loader, usamos un hook UseEffect
        
      ]
      //Si quieres crear un componente layout creas un objeto json si path y con propiedad children (pones rutas de los componentes que quieres cargar dentro)
    },
    {
      path:"/Cliente/Login", element: <Login/>
    },
    {
      path:"/Cliente/Registro", element: <Registro3/>
    },
    {path:"Pedido/MostrarPedido", element:<MostrarPedido/>, loader: pedidoRESTService.recuperarProvincias} 
  ]
);

//---------------------------- contextos para pasar al provider -------------------------------------

const clienteLoggedContext= createContext(null);
const itemsCarroContext = createContext(null);

function App() {
  const [clienteLogged, setClienteLogged]= useState(null);
  const [itemsCarro, setItemsCarro]=useState([]);
  
  
  return (
    <clienteLoggedContext.Provider value={{clienteLogged, setClienteLogged}}>
      <itemsCarroContext.Provider value={{itemsCarro, setItemsCarro}}>
      <RouterProvider router= {routerObjects}/>
      </itemsCarroContext.Provider>
    </clienteLoggedContext.Provider>
  );
}

//---- exporto hooks personalizados para que componentes hijos puedan usar variables de contexto global -----
//1º valor {clienteLogged:{datoscliente:..., jwt:...}, setClienteLogged: function(){...}}}}}}
//2ºvalor {itemsCarrito:[{isbn13:..., cantidad:...},...], setItemsCarrito: function(){...}}}}}}
export function useClienteLoggedContext(){
  return useContext(clienteLoggedContext);
};
export function useItemsCarroContext(){
  return useContext(itemsCarroContext);
};
export default App;

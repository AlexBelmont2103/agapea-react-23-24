import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Login from "./componentes/zonaCliente/loginComponente/Login";
import Registro3 from "./componentes/zonaCliente/registroComponente/Registro3";
import InicioPanel from "./componentes/zonaCliente/inicioPanelComponente/InicioPanel";
import MisCompras from "./componentes/zonaCliente/inicioPanelComponente/MisCompras";
import MisOpiniones from "./componentes/zonaCliente/inicioPanelComponente/MisOpiniones";
import MisListas from "./componentes/zonaCliente/inicioPanelComponente/MisListas";
import Layout from "./componentes/zonaTienda/layoutComponente/Layout";
import Libros from "./componentes/zonaTienda/librosComponente/Libros";
import MostrarLibro from "./componentes/zonaTienda/librosComponente/MostrarLibro";
import tiendaRESTService from "./servicios/restTienda";
import MostrarPedido from "./componentes/zonaTienda/pedidosComponente/MostrarPedido";
import pedidoRESTService from "./servicios/restPedido";
import FinalizarPedidoOk from "./componentes/zonaTienda/pedidosComponente/FinalizarPedidoOk";
import { ClienteLoggedProvider } from "./contextProviders/clienteLoggedContext";
import { ItemsCarroProvider } from "./contextProviders/itemsCarroContext";

//-----------------------------------------------------------------
//Array de objetos Route creados con CreateBrowserRouter
//Pasar al proveedor de rutas RouterProvider

const routerObjects = createBrowserRouter([
  {
    element: <Layout />,
    loader: tiendaRESTService.recuperarCategorias, //Funcion async que se ejecuta de forma paralela
    children: [
      { path: "/", element: <Navigate to="Tienda/Libros/" /> },
      {
        path: "/Tienda/Libros/:idcategoria?",
        element: <Libros />,
        loader: tiendaRESTService.recuperarLibros,
      },
      { path: "Tienda/MostrarLibro/:isbn13", element: <MostrarLibro /> }, //En vez de usar un loader, usamos un hook UseEffect
    ],
    //Si quieres crear un componente layout creas un objeto json si path y con propiedad children (pones rutas de los componentes que quieres cargar dentro)
  },
  {
    path: "/Cliente/Login",
    element: <Login />,
  },
  {
    path: "/Cliente/Registro",
    element: <Registro3 />,
  },
  {
    path: '/Cliente/Panel',
    element: <Layout/>,
    loader: async ()=>{ return ["Inicio Panel", "Mis Compras","Mis Opiniones","Mis Listas"] }, //lo suyo seria recup.desde bd 
    children:[
                { path: 'InicioPanel', element:<InicioPanel/>},
                { path: 'MisCompras', element:<MisCompras />},
                { path: 'MisOpiniones', element:<MisOpiniones />},
                { path: 'MisListas', element:<MisListas/>},
    ]
  },
  {
    path: "Pedido/MostrarPedido",
    element: <MostrarPedido />,
    loader: pedidoRESTService.recuperarProvincias,
  },
  { path:'/Pedido/FinalizarPedidoOK', element: <FinalizarPedidoOk/>},
]);

function App2() {
  return (
    <ClienteLoggedProvider>
      <ItemsCarroProvider>
        <RouterProvider router={routerObjects} />
      </ItemsCarroProvider>
    </ClienteLoggedProvider>
  );
}

export default App2;

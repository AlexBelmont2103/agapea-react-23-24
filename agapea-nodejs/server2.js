//------- modulo principal de entrada app. nodejs config express con mongo -------
//- definimos instancia de express
//- definimos instancia de mongo
//-lanzamos ambos servers
require("dotenv").config(); //<--PAQUETE PARa definir como variable de entorno en fihcero .env valores criticos
const express = require("express"); //<-- en la variable express se almaacena la funccion q genera el servidor web, exportada por el modulo
var serverExpress = express();

const mongoose = require("mongoose"); //<-- en la variable mongoose se almacena la funccion q genera el servidor de mongo, exportada por el modulo
const configServer = require("./config_server_express/config_pipeline");

//-----configuracion de express
serverExpress.listen(5000, () => console.log("servidor web express eschuchando por el puerto 5000"));
configServer(serverExpress);  //<--configuracion de la pipeline del servidor express



//-----conexion al servidor mongodb
mongoose
  .connect(process.env.CONNECTION_MONGODB)
  .then(() =>
    console.log(
      "..conexion al servidor bg mongo establecido de forma correcta..."
    )
  )
  .catch((err) =>
    console.log("fallo el conectarnos al servidor de bd de mongo" + err)
  );
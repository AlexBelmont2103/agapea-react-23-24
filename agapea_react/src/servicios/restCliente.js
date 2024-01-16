//modulo donde exporto funciones javascript para hacer pet.ajax al servicio RESTFULL montado sobre NODEJS....
export async function RegistrarCliente( { nombre,apellidos,email,password,login,telefono} ){
  if (login==='') login=email;


//#region -----------------  pet.Ajax con XMLHTTPREQUEST ----------------

  //envolvemos pet.ajax en un objeto PROMISE....
  //en el prototipo, el argumento pasado es una funcion con dos parametros:
  // - resolve:  una funcion q va a devolver los datos de la promesia si se ejecuta de forma correcta
  //              es lo q se recoje en el .then()
  // - reject:  una funcion q va a devolver los datos cuando quieres q la promesa se ejecute de forma
  //          incorrecta, estos datos los recogeria el catch()

  // var _promiseResult=new Promise(
  //     (resolve,reject)=>{
  //         var petAjax=new XMLHttpRequest();
  //         petAjax.open('POST','http://localhost:3003/api/Cliente/Registro');
  //         petAjax.setRequestHeader('Content-Type','application/json');
      
  //         petAjax.addEventListener('readystatechange',()=>{
  //             if( petAjax.readyState === 4){
  //                 console.log(petAjax);
      
  //                 switch (petAjax.status) {
  //                     case 200:
  //                         //la respuesta del server esta en petAjax.responseText
  //                         var respuesta=JSON.parse(petAjax.responseText);
  //                         resolve(respuesta);                                                        
  //                         break;

  //                     default:
  //                         reject( { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de registrar cliente...' });
  //                         break;
  //                 }
  //             }
  //         });
      
  //         petAjax.send(JSON.stringify( { nombre,apellidos,login,telefono,email,password} ));  
  //     }
  // );

  // return _promiseResult;


//#endregion

//#region -----------------  pet.Ajax con FETCH-API -----------------------
try {
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/Registro',
                               {
                                  method: 'POST',
                                  body: JSON.stringify({ nombre,apellidos,email,password,login,telefono}),
                                  headers: { 'Content-Type': 'application/json '}
                               }
                              );
      return await _petAjax.json();

  } catch (error) {
      return { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de registrar cliente...' };
  }
//#endregion
 
}
export async function LoginCliente( datoslogin ){
  try {
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/Login',
                              {
                              method: 'POST',
                              body: JSON.stringify(datoslogin) ,
                              headers: { 'Content-Type': 'application/json '}
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }

}

export async function SubirFoto(datosFoto){
  try {
      let imagen = datosFoto.imagen;
      let jwt = datosFoto.jwt;
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/SubirFoto',
                              {
                              method: 'POST',
                              body: JSON.stringify({imagen}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${jwt}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}

export async function ActualizarCliente(datosEnviar){
  try {
    console.log("Datos recibidos...",datosEnviar);
    let datosCliente=datosEnviar.datosCliente;
    console.log("Datos cliente",datosCliente);
    let jwt = datosEnviar.jwt;
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/ActualizarCliente',
                              {
                              method: 'POST',
                              body: JSON.stringify({datosCliente}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${jwt}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}

export  async function RecuperarDatosCliente(idcliente, jwtUnUso){
  try{
    let _respServer=await fetch(
      `http://localhost:5000/api/Cliente/RecuperarDatosCliente`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json ', 
        'Authorization': `Bearer ${jwtUnUso}`},
        body: JSON.stringify({idcliente}),
      }
    );
    console.log("Respuesta del server...",_respServer);
    if (! _respServer.ok) throw new Error('error al intentar obtener datos del cliente tras finalizar pago por paypal...');
    
    return _respServer.json();
  }catch(error){
    console.log("Error al recuperar datos del cliente...",error);
    return null;
  }
}

export async function AgregarDireccion(direccion, tokensesion){
  try {
    console.log("Datos recibidos...",direccion);
    console.log("Token de sesion...",tokensesion);
    
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/AgregarDireccion',
                              {
                              method: 'POST',
                              body: JSON.stringify({direccion}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${tokensesion}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}

export async function ModificarDireccion(direccion, tokensesion){
  try {
    console.log("Datos recibidos...",direccion);
    console.log("Token de sesion...",tokensesion);
    
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/ModificarDireccion',
                              {
                              method: 'POST',
                              body: JSON.stringify({direccion}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${tokensesion}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}
export async function EliminarDireccion(idDireccion, tokensesion){
  try {
    console.log("Datos recibidos...",idDireccion);
    console.log("Token de sesion...",tokensesion);
    
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/EliminarDireccion',
                              {
                              method: 'POST',
                              body: JSON.stringify({idDireccion}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${tokensesion}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}
export async function EliminarPrincipal(idDireccion, tokensesion){
  try {
    console.log("Datos recibidos...",idDireccion);
    console.log("Token de sesion...",tokensesion);
    
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/EliminarPrincipal',
                              {
                              method: 'POST',
                              body: JSON.stringify({idDireccion}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${tokensesion}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}
export async function HacerDirPrincipal(idDireccion, tokensesion){
  try {
    console.log("Datos recibidos...",idDireccion);
    console.log("Token de sesion...",tokensesion);
    
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/HacerDirPrincipal',
                              {
                              method: 'POST',
                              body: JSON.stringify({idDireccion}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${tokensesion}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}
export async function crearListaDeseos(nombreLista, tokensesion){
  try {
    console.log("Datos recibidos...",nombreLista);
    console.log("Token de sesion...",tokensesion);
    
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/CrearListaDeseos',
                              {
                              method: 'POST',
                              body: JSON.stringify({nombreLista}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${tokensesion}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}
export async function AgregarLibroListaDeseos(idListaDeseos, idLibro, tokensesion){
  try {
    console.log("Datos recibidos...",idListaDeseos,idLibro);
    console.log("Token de sesion...",tokensesion);
    
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/AgregarLibroListaDeseos',
                              {
                              method: 'POST',
                              body: JSON.stringify({idListaDeseos, idLibro}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${tokensesion}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}
 export async function EliminarLibroListaDeseos(idListaDeseos, idLibro, tokensesion){
  try {
    console.log("Datos recibidos...",idListaDeseos);
    console.log("Token de sesion...",tokensesion);
    
      var _petAjax=await fetch('http://localhost:5000/api/Cliente/EliminarLibroListaDeseos',
                              {
                              method: 'POST',
                              body: JSON.stringify({idListaDeseos, idLibro}) ,
                              headers: { 
                                'Content-Type': 'application/json ',
                                "Authorization": `Bearer ${tokensesion}`
                              }
                              }
                         );
      return await _petAjax.json();  
        
  } catch (error) {
      return JSON.parse(error);
  }
}
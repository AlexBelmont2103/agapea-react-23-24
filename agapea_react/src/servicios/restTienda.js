//modulo donde exporto funciones javascript para hacer peticiones ajax al servicio RESTFULL montado sobre NODEJS relacionado con la tienda
//No se exportan funciones individuales, se exporta un objeto con funciones

let tiendaRESTService={
    recuperarCategorias: async function({request, params}){
        try{
            var _idCategoria = params.idcategoria;
            if(typeof _idCategoria === "undefined"){
                _idCategoria = "padres";
            }
            var cats = await fetch(`http://localhost:5000/api/Tienda/RecuperarCategorias/${_idCategoria}`);
            return await cats.json();
        }catch(error){
            return [];
        }
    },
    recuperarLibros: async function({request, params}){
        try{
            var _idCategoria = params.idcategoria;
            if(typeof _idCategoria === "undefined"){
                _idCategoria = "2-10";
            }
            var libros = await fetch(`http://localhost:5000/api/Tienda/RecuperarLibros/${_idCategoria}`);
            return await libros.json();
        }catch(error){
            return [];
        }
    },

    recuperarLibro: async function(isbn13){
        try{
            let _libro=await fetch(`http://localhost:5000/api/Tienda/RecuperarLibro/${isbn13}`);
            return await _libro.json();
        }catch(error){
            return [];
        }
    },
    enviarComentario: async function(datos, tokensesion){
        console.log("Datos a enviar: ", datos);
        try{
            let _comentario=await fetch("http://localhost:5000/api/Tienda/EnviarComentario",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokensesion}`
                },
                body: JSON.stringify(datos),
            });
            return await _comentario.json();
        }catch(error){
            return [];
        }
    },
    editarComentario: async function(datos, tokensesion){
        console.log("Datos a enviar: ", datos);
        try{
            let _comentario=await fetch("http://localhost:5000/api/Tienda/EditarComentario",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokensesion}`
                },
                body: JSON.stringify(datos),
            });
            return await _comentario.json();
        }catch(error){
            return [];
        }
    },
    recuperarComentarios: async function(idLibro){
        try{
            let _comentarios=await fetch(`http://localhost:5000/api/Tienda/RecuperarComentarios/${idLibro}`);
            return await _comentarios.json();
        }catch(error){
            return [];
        }
    }
}
export default tiendaRESTService;
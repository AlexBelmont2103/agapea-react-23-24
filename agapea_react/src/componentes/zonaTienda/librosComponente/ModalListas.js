import { useState, useEffect } from 'react';
import { useClienteLoggedContext } from "../../../contextProviders/clienteLoggedContext";
import { AgregarLibroListaDeseos, EliminarLibroListaDeseos } from '../../../servicios/restCliente';

function ModalListas({ idLibro }) {
    const { clienteLogged, dispatch } = useClienteLoggedContext();
    const [selectedLista, setSelectedLista] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    function handleListaChange(event) {
        setSelectedLista(event.target.value);
    }
    function handleCheckboxChange(event) {
        setIsChecked(event.target.checked);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        //Si el checkbox está marcado
        if (isChecked) {
            //Comprobamos si el libro ya está en la lista
            let lista = clienteLogged.datoscliente.listasDeseos.find((lista) => lista._id === selectedLista);
            if (lista.libros.some((libro) => libro._id === idLibro)) {
                alert("El libro ya está en la lista");
            }else{
                //Si no está en la lista, lo añadimos
                const _respServer = await AgregarLibroListaDeseos(selectedLista, idLibro, clienteLogged.tokensesion);
                console.log('Respuesta del servidor al intentar agregar libro a lista de deseos', _respServer);
                if (_respServer.codigo === 0) {
                    let _payload = {
                        datoscliente: _respServer.datoscliente,
                        tokensesion: _respServer.jwt
                    };
                    dispatch({ type: 'CLIENTE_UPDATE', payload: _payload });
                } else {
                    alert(_respServer.mensaje);
                }
            }
        }else{
            //Comprobamos si el libro no está en la lista
            let lista = clienteLogged.datoscliente.listasDeseos.find((lista) => lista._id === selectedLista);
            if (!lista.libros.some((libro) => libro._id === idLibro)) {
                alert("El libro no está en la lista");
            }else{
                //Si está en la lista, lo eliminamos
                const _respServer = await EliminarLibroListaDeseos(selectedLista, idLibro, clienteLogged.tokensesion);
                console.log('Respuesta del servidor al intentar eliminar libro de lista de deseos', _respServer);
                if (_respServer.codigo === 0) {
                    let _payload = {
                        datoscliente: _respServer.datoscliente,
                        tokensesion: _respServer.jwt
                    };
                    dispatch({ type: 'CLIENTE_UPDATE', payload: _payload });
                } else {
                    alert(_respServer.mensaje);
                }
            }
        }

    }

    // Efecto para modificar el estado de la checkbox si el libro ya está en la lista
    useEffect(() => {
        if (clienteLogged) {
            let lista = clienteLogged.datoscliente.listasDeseos.find((lista) => lista._id === selectedLista);
            setIsChecked(!!lista && lista.libros.some((libro) => libro._id === idLibro));
        }
    }, [selectedLista]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Selecciona una lista:
                    <select value={selectedLista} onChange={handleListaChange}>
                        <option value="">Selecciona una lista</option>
                        {clienteLogged.datoscliente.listasDeseos.map((lista) => (
                            <option key={lista._id} value={lista._id}>
                                {lista.nombreLista}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                    Añadir a la lista
                </label>
                <input type="submit" value="Enviar" />
            </form>
        </div>
    );
}

export default ModalListas;

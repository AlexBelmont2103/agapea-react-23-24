import {useState} from 'react';

function DatosPago( {datosPago, setDatosPago} ){

    let [ showCard, setShowCard ]=useState(true);

    function ChangeInputsEventHandler(ev){
        let { name, value }=ev.target;
        if(name==='pagoradios'){
            value==='pagotarjeta'? setShowCard(true) : setShowCard(false);
        }
        setDatosPago( { ...datosPago, [name]: value }); 
    }
    return (
    <div className="container">
        <div className="row mt-4">
            <div className="col-1"><img src="/images/im3_motrar_pedido_pago.png" style={{width: "40px",height:"26px"}} alt="..."/></div>
            <div className="col-11" id="txtpago"><h4><strong>2.- Pago</strong></h4></div>
        </div>

        <div className="row">
            <div className="col">
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="pagoradios" id="pagotarjeta" defaultChecked value="pagotarjeta" onChange={ ChangeInputsEventHandler }/>
                    <label className="form-check-label" htmlFor="pagotarjeta">
                        Pago con tarjeta
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="pagoradios" id="pagopaypal" value="pagopaypal" onChange={ ChangeInputsEventHandler }/>
                    <label className="form-check-label" htmlFor="pagopaypal">
                        Pago mediante <img src="/images/paypal.gif" alt=".." />
                    </label>
                </div>
            </div>
        </div>
        {
            showCard && (
                <div className="row mt-2" id="filadatoscardcontainer">
                    <div className="container" id="datoscardcontainer" style={{backgroundColor:"#ededed"}}>
                        <div className="row">
                            <div className="col"><h5>Datos de la tarjeta</h5></div>
                        </div>
        
                        <div className="row">
                            <div className="col-5">
                                <label htmlFor="inputNumero" className="form-label">Numero de la tarjeta *</label>
                                <input type="text" id="inputNumero" className="form-control" name="numerocard" onChange={ ChangeInputsEventHandler } />
                            </div>
        
                            <div className="col-3">
                                <label className="form-label">Fecha caducidad</label>
                                <select id="inputAnio" className="form-select" name="aniocard" onChange={ChangeInputsEventHandler} >
                                    {
                                        Array.from({length:10}, (_,i) => i + 1).map(
                                            pos => {
                                                var anio=(new Date(Date.now()).getFullYear()) + pos;
                                                return <option value={anio} key={anio}>{anio}</option>
                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className="col-2">
                                <label className="form-label">Año/Mes</label>
                                <select id="inputMes" className="form-select" name="mescard" onChange={ChangeInputsEventHandler}>
                                    {
                                        Array.from( {length: 12}, (_,i) => i+1 ).map(
                                            pos => <option value={pos} key={pos}>{pos}</option>
                                        )
                                    }
                                </select>
                            </div>
        
                            <div className="col-2">
                                <label htmlFor="inputCVV" className="form-label">CVV *</label>
                                <input type="text" className="form-control" id="inputCVV" name="cvv"  onChange={ChangeInputsEventHandler} />
                            </div>
                        </div>
        
                        <div className="row">
                            <div className="col">
                                <label htmlFor="inputNombreBanco" className="form-label">Nombre del banco de la tarjeta *</label>
                                <input type="text" className="form-control" id="inputNombreBanco" name="nombrebancocard" />
                            </div>
                        </div>
        
                        <div className="row mt-2">
                            <div className="col"><img src="/images/tarjetas.png" style={{width: "200px", height: "41px"}} alt="..."/><span className="text-muted">Pago Seguro 100% garantizado</span></div>
                        </div>
                    </div>
                </div>
            )
        }
    </div>        
    );
}
export default DatosPago;
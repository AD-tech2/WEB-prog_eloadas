import { useRef } from "react";

function InputElement({Label = "", Placholder = "", isNextToLabel = false}) {
    if(isNextToLabel) {
        return (
            <label>
                {Label}
                <input type="number" placeholder={Placholder}/>
            </label>
        );
    }
    return (
        <label>
            {Label} <br/>
            <input type="number" placeholder={Placholder}/>
        </label>
    );
}
function Currency({CurrencyName, ShortForm = null}) {
    if(ShortForm === null) {
        return (
            <option>
                {CurrencyName}
            </option>
        );
    }
    return (
        <option>
            {CurrencyName} [{ShortForm}]
        </option>
    );
}
function ListOfCurrency({CurrencyList = []}) {
    if(CurrencyList.length === 0 || CurrencyList === null)
        throw new Error("Cannont load in an Empty or null list");
    return (
        <>
            {CurrencyList.map((Cur, key) => {
                return <Currency key={Cur.id} CurrencyName={Cur.name} ShortForm={Cur.short}></Currency>
            })}
        </>
    );
}
function CurrencySelectBlock({Lable = "", Content = null}) {
    if(Content === null)
        throw new Error("Cannot make a block with nothing");
    return (
        <div>
            <label>{Lable}</label> <br/>
            <select>{Content}</select>
        </div>
    );
}

//Main ezt kell majd inportálni az App.jsx-be:
export default function CurrencyExchanger() {
    //Ez a ref fogja tárolni az új valutát:
    const CurrencyList = useRef([
        {id: 0, name: "szia", short: "sz", unit_price: 20},
        {id: 1, name: "hello", short: "he", unit_price: 340}
    ]);

    const addCurrency = (newCurrency) => CurrencyList.current.push(newCurrency);
    const getCurrencies = () => CurrencyList.current;

    function CalculateResult(mode = "", DataSet = {input_unit: 0, calculated: 0, From_id: 0, To_id: 0}) {
        const ToPrice = getCurrencies().map((rec) => {
            if(rec.id === DataSet.To_id) return rec.unit_price;
        });
        const FromPirce = getCurrencies().map((rec) => {
            if(rec.id === DataSet.From_id) return rec.unit_price;
        });
        if(mode === "simp")
            return DataSet.calculated = input_unit / FromPirce * ToPrice;
        return DataSet.calculated = input_unit * ToPrice / FromPirce;
    }

    return (
        <>
            <div>
                <InputElement Label="Összeg: " Placholder="Semmi"/>
                <CurrencySelectBlock
                    Lable="Miről?"
                    Content={<>
                        <Currency CurrencyName={"None"}/>
                        <ListOfCurrency CurrencyList={getCurrencies()}/>
                    </>}/>
                <CurrencySelectBlock
                    Lable="Mire?"
                    Content={<>
                        <Currency CurrencyName={"None"}/>
                        <ListOfCurrency CurrencyList={getCurrencies()}/>
                </>}/>
                <button>Eredmény</button>
            </div>
        </>
    );
}
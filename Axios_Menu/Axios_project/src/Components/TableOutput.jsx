//Ez egy fontos elem mert ez az ami tárolja az adatokat és megjeleníti + esemény kezelők:
function Record({Attributes = {fkod: null, name: "", born: 0, died: 0}, HandlerCollection = { Update: null, Delete: null, Handler: null, Refs: null}}) {
    if(Attributes.id === null || Attributes === null || Attributes.name === "" || Attributes.born === 0)
        throw new Error("Invalid record attributes!");
    return (
        <tr>
            {Object.entries(Attributes).map(([key, value], num)=> {
                //Ide kell az ID amit takarni akarunk
                if(key !== "fkod") return (
                    <td key={num}>{value ?? "(null)"}</td>
                );
            })}
            <td>
                <button onClick={() => {
                    HandlerCollection.Update({
                        IsUpdate: true,
                        Id: Attributes.fkod
                    });
                    const ValuesToSet = Object.entries(Attributes).filter(([key]) => key != "fkod").map(([key, value]) => value);
                    let i = 0;
                    Object.entries(HandlerCollection.Refs).map(([inputs, inpvals]) => {
                        inpvals.current.value = ValuesToSet[i++];
                    });
                }}>Change</button>
                <button onClick={() => {
                    if(confirm("Are your sure you want to remove?"))
                        HandlerCollection.Delete(HandlerCollection.Handler, Attributes.fkod);
                }}>Remove</button>
            </td>
        </tr>
    );
}

//Táblázat keret ami tárolja a rekord elemeket:
export default function TableElement({ColumnNames = [], Records = [], HandlerCollection = { Update: null, Delete: null, Handler: null}}) {
    if(ColumnNames.length === 0)
        throw new Error("Cannot load a table without column names!");
    return (
        <table>
            <thead>
                <tr>
                    {ColumnNames.map((Column, num) => {
                        return (
                            <th key={num}>{Column}</th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {Records.map((rec, num) => {
                    return <Record key={num} Attributes={rec} HandlerCollection={HandlerCollection}/>
                })}
            </tbody>
        </table>
    );
}
export function Record({Attributes = {name: "", born: 0, died: 0}}) {
    if(Attributes === null || Attributes.name === "" || Attributes.born === 0)
        throw new Error("Invalid record attributes!");
    return (
        <tr>
            {Object.entries(Attributes).map(([key, value], num)=> {
                return (
                    <td key={num}>{value}</td>
                );
            })}
        </tr>
    );
}


export default function TableElement({ColumnNames = [], Records = []}) {
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
                    return <Record key={num} Attributes={rec}/>
                })}
            </tbody>
        </table>
    );
}
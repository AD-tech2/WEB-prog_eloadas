import axios from "axios"

export function ReadUserInput(Referencies = {name: null, born: null, died: null}) {
    let RecordData = OutputFormat;
    Object.entries(References).map(([RefName, RefValue]) => {
        RecordData[RefName] = RefValue.current.value;
    });
    return ValueList;
}

export async function ReadInventors(Handler) {
    if(DatabaseHandler === null || DatabaseHandler === "")
        throw new Error("There is no given handler!");
    try {
        const Payload = await axios.get(Handler);
        if(Payload.data.Fail)
            throw new Error("The fetch is failed!");
        return Payload.data;
    } catch(err) {
        console.log("Read: Unable to get data from the server!");
        return null;
    }
}
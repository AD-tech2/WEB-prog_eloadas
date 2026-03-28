import axios from "axios"

//Arra jó ha megadjuk a referenciát akkor készít egy PHP-nek mefelelő JSON formátumú listát:
export function ReadUserInput(Referencies) {
    let RecordData = {Name: null, Born: null, Died: null};
    Object.entries(Referencies).map(([RefName, RefValue]) => {
        if(RefValue.current.value === null || RefValue.current.value === "")
            RecordData[RefName] = null;
        else RecordData[RefName] = RefValue.current.value;
    });
    return RecordData;
}

export async function ReadSpecificInventor(Handler, Specification = { Column: "", Value: ""}) {
    if(Specification === null || Specification.Column === "" || Specification.Value === "")
        throw new Error("There is not a given Specification!");
    try {
        const Payload = await axios.get(Handler+"?Spec="+JSON.stringify(Specification));
        if(Payload.data.Fail)
            throw new Error("The fetch is failed!");
        return Payload.data;
    } catch(Error) {
        console.log("Specific Read: Unable to get data from the server!")
        return null;
    }
}

//Olvasási kérelem a PHP fele
export async function ReadInventors(Handler) {
    if(Handler === null || Handler === "")
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
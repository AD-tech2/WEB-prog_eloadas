import { ReadInventors, ReadUserInput } from "./ReadStream";
import axios from "axios";

export async function CreateInventor(Handler) {
    if(Handler === "" || Handler === null)
        throw new Error("There is no given handler!")
    if(RecordData === null)
        throw new Error("Cannot create an empty record!");
    try {
        const Flag = await axios.post(Handler, ReadUserInput());
        return Flag.data.Fail;
    } catch(Err) {
        console.log("Update: Unable to update data on the server!")
        return false;
    }
}
//Be kell fejezni a maradékot!
export async function UpdateInventor(Handler) {
    try {

    } catch(Err) {
        console.log("Update: Unable to update data on the server!")
    }
}

export async function DeleteInventor(Handler, Id) {
    try {

    } catch(Err) {
        console.log("Delete: Unable to update data on the server!")
    }
}
import axios from "axios";

export async function CreateInventor(Handler = null, NewRecord) {
    if(Handler === "" || Handler === null)
        throw new Error("There is no given handler!")
    if(NewRecord === null)
        throw new Error("Cannot create an empty record!");
    try {
        const Payload = await axios.post(Handler, {
            Record: NewRecord
        });
        return Payload.data.Fail;
    } catch(Err) {
        console.log("Update: Unable to update data on the server!")
        return false;
    }
}

export async function UpdateInventor(Handler = null, Id = null, UpdatedRecord) {
    if(Handler === "" || Handler === null || Id === null)
        throw new Error("Incorrect parameters, there should be a valid handler and a Id given!");
    try {
        const Payload = await axios.put(Handler, {
            Id: Id,
            ToThis: UpdatedRecord
        });
        return Payload.data.Fail;
    } catch(Err) {
        console.log("Update: Unable to update data on the server!");
        return false;
    }
}

export async function DeleteInventor(Handler = null, Id = null) {
    if(Handler === "" || Handler === null || Id === null)
        throw new Error("Incorrect parameters, there should be a valid handler and a Id given!");
    try {
        const Payload = await axios.delete(Handler, {data: { Id: Id }});
        return Payload.data.Fail;
    } catch(Err) {
        console.log("Delete: Unable to update data on the server!");
        return false;
    }
}
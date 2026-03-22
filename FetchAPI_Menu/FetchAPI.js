const InputElements = {
    Name: document.getElementById("Name"),
    Born: document.getElementById("Born"),
    Died: document.getElementById("Died")
};//= Input elemek
const OutputElement = document.getElementById("OutputArea");//= a tbody elemmel
const ResponsElement = document.getElementById("ResponsArea");//= ide jönnek az üzenetek a fetch-ből!
const SaveButton = document.getElementById("SaveButton");//form-nak a submit gombja
const ServerApi = "HandleRequest.php";

//================================== Fetch rendszer ========================================

const SelectedInventor = {
    Id: null,
    isEdit: false
};

function ReadUserInput() {
    const InputStreamData = {
        Name: InputElements.Name.value,
        Born: InputElements.Born.value,
        Died: InputElements.Died.value
    };
    return InputStreamData;
}

//Ha ezekbe keletkezik hiba a fetch elkapja majd!
function CreateCell(Data = null) {
    const NewCell = document.createElement("td");
    if(Data === "" || Data === null) NewCell.textContent = "(null)";
    else NewCell.textContent = Data;
    return NewCell;
}

function CreateButtonRef(Id = null, IsEditBt = false) {
    if(Id === null || !Number.isInteger(Id))
        throw new Error("Cannot create reffrence button without a refferenc (id).");
    const Button = document.createElement("button");
    if(IsEditBt) {
        Button.textContent = "Change";
        Button.addEventListener("click", (Id) => {
            SelectedInventor.Id = Id;
            SelectedInventor.isEdit = true;
        });
        return Button;
    }
    Button.textContent = "Delete";
    Button.addEventListener("click", (Id) => {
        SelectedInventor.Id = Id;
        SelectedInventor.isEdit = false;
    });
    return Button;
}

function CreateRow(Record = null) {
    if(Record === null)
        throw new Error("Cannot load an empty Record!");
    const NewRow = document.createElement("tr");
    //Adatok betöltése:
    Object.entries(Record).forEach(([key, value]) => {
        if(key !== "fkod") NewRow.appendChild(CreateCell(value));
    });
    const ButtonsCell = CreateCell(""); ButtonsCell.innerHTML = "";
    ButtonsCell.appendChild(CreateButtonRef(Record.fkod), true);//= Update button
    ButtonsCell.appendChild(CreateButtonRef(Record.fkod));//= Delete button
    NewRow.appendChild(ButtonsCell);
    return NewRow;
}

function ReadInventors() {
    fetch(ServerApi)
    .then(Resp => Resp.json())
    .then(Payload => {
        if(Payload.Fail)
            throw new Error("Cannot load in!");
        else {
            if(!Array.isArray(Payload.Records))
               throw new Error("Cannot load in!");
            //Adatok betöltése:
            OutputElement.innerHTML = "";
            Payload.Records.forEach(Record => {OutputElement.appendChild(CreateRow(Record));});
            ResponsElement.innerHTML = "<br>The inventors are succesfully loaded!";
        }
    })
    .catch(Err => ResponsElement.innerHTML += "<br>Error: Cannot load the inventors!");
}

function CreateInventor(Record = {Name: "", Born: 0, Died: 0}) {
    fetch(ServerApi, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(Record)
    })
    .then(Resp => Resp.json())
    .then(Payload => {
        if(Payload.Fail)
            throw new Error("Cannot save Inventor!");
        else {
            ResponsElement.innerHTML += "The new inventor is succesfully saved!";
            ReadInventors();
        }
    })
    .catch(Err => ResponsElement.innerHTML = "Error: Cannot save the new inventor!");
}

function DeleteInventor(Id) {
    if(!confirm("Are you sure you want to delete this inventor?")) return;
    fetch(ServerApi, {
        method: "DELETE",
        headers: {"Content-Type:": "application/json"},
        body: JSON.stringify(Id)
    })
    .then(Resp => Resp.json())
    .then(Payload => {
        if(Payload.Fail)
            throw new Error("Cannot delete the selected record!");
        else {
            ResponsElement.innerHTML += "The selected inventor is succesfully deleted!";
            ReadInventors();
        }
    })
    .catch(Err => ResponsElement.innerHTML = "Error: Cannot delete the selected inventor!");
}

function UpdateInventor(Id) {
    //JSON formátumba hogy milyen id-t és mire kell update-elni a szervernek:
    const UpdateToThis = {
        Id: Id,
        ToThis: ReadUserInput()
    };
    fetch(ServerApi, {
        method: "PUT",
        headers: {"Content-Type:": "application/json"},
        body: JSON.stringify(UpdateToThis)
    })
    .then(Resp => Resp.json())
    .then(Payload => {
        if(Payload.Fail)
            throw new Error("Cannot update the selected record!");
        else {
            ResponsElement.innerHTML += "The selected inventor is succesfully updated!";
            ReadInventors();
        }
    })
    .catch(Err => ResponsElement.innerHTML = "Error: Cannot update the selected inventor!");
}


//Vezérlő gomb amivel interaktálunk a szerver fele:
SaveButton.addEventListener("submit", (e) => {
    e.preventDefault();
    if(SelectedInventor.isEdit)
        UpdateInventor(SelectedInventor.Id);
    else DeleteInventor(SelectedInventor.Id);
    //Input elemek nullázása:
    Object.entries(InputElements).forEach(elem => elem.value = "");
});

document.addEventListener("DOMContentLoaded", () => {ReadInventors(); console.log("lefutott");});
const InputElements = {
    Name: document.getElementById("Name"),
    Born: document.getElementById("Born"),
    Died: document.getElementById("Died")
};//= Input elemek
const OutputElement = document.getElementById("OutputArea");//= a tbody elemmel
const ResponsElement = document.getElementById("ResponsArea");//= ide jönnek az üzenetek a fetch-ből!
const SaveButton = document.getElementById("SaveButton");//form-nak a submit gombja
const ResetButton = document.getElementById("ResetButton");
const ServerApi = "./PHP/HandleRequest.php";

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
    NewCell.className = "crud";
    return NewCell;
}

function CreateButtonRef(Record = null, IsEditBt = false) {
    if(Record === null)
        throw new Error("Cannot create reffrence button without a refferenc (id).");
    const Button = document.createElement("button");
    Button.className = "crud";
    if(IsEditBt) {
        Button.textContent = "Change";
        Button.addEventListener("click", () => {
            SelectedInventor.Id = Record.fkod;
            SelectedInventor.isEdit = true;
            //Adatok betöltése:
            let index = 1;
            RecordValueList = Object.entries(Record).map(([key, value]) => value);
            Object.entries(InputElements).forEach(([key, elem]) => elem.value = RecordValueList[index++]);
        });
        return Button;
    }
    Button.textContent = "Delete";
    Button.addEventListener("click", () => {
        DeleteInventor(Record.fkod);
        SelectedInventor.Id = null;
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
    ButtonsCell.appendChild(CreateButtonRef(Record, true));//= Update button
    ButtonsCell.appendChild(CreateButtonRef(Record));//= Delete button
    NewRow.appendChild(ButtonsCell);
    NewRow.className = "crud";
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
            ResponsElement.innerHTML += "The inventors are succesfully loaded!<br>";
        }
    })
    .catch(Err => {
        ResponsElement.innerHTML += "Error: Cannot load the inventors!<br>";
        console.log("Read: " + Err.message);
    });
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
            ResponsElement.innerHTML += "The new inventor is succesfully saved!<br>";
            ReadInventors();
        }
    })
    .catch(Err => {
        ResponsElement.innerHTML = "Error: Cannot save the new inventor!<br>";
        console.log("Create: " + Err.message);
    });
}

function DeleteInventor(Id) {
    if(!confirm("Are you sure you want to delete this inventor?")) return;
    fetch(ServerApi, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(Id)
    })
    .then(Resp => Resp.json())
    .then(Payload => {
        if(Payload.Fail)
            throw new Error("Cannot delete the selected record!");
        else {
            ResponsElement.innerHTML += "The selected inventor is succesfully deleted!<br>";
            ReadInventors();
        }
    })
    .catch(Err => {
        ResponsElement.innerHTML = "Error: Cannot delete the selected inventor!<br>";
        console.log("Delete: " + Err.message);
    });
    ResponsElement.innerHTML = "";
}

function UpdateInventor(Id) {
    const UpdateToThis = {
        Id: Id,
        ToThis: ReadUserInput()
    };
    fetch(ServerApi, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(UpdateToThis)
    })
    .then(Resp => Resp.json())
    .then(Payload => {
        if(Payload.Fail)
            throw new Error("Cannot update the selected record!");
        else {
            ResponsElement.innerHTML += "The selected inventor is succesfully updated!<br>";
            ReadInventors();
        }
    })
    .catch(Err => {
        ResponsElement.innerHTML = "Error: Cannot update the selected inventor!<br>";
        console.log("Update: " + Err.message);
    });
}


//Vezérlő gomb amivel interaktálunk a szerver fele:
SaveButton.addEventListener("click", (e) => {
    e.preventDefault();

    ResponsElement.style.display = "block";
    ResponsElement.style.padding = "15px";
    ResponsElement.style.marginBottom = "20px";
    ResponsElement.style.borderRadius = "5px";

    if(SelectedInventor.isEdit)
        UpdateInventor(SelectedInventor.Id);
    else 
        CreateInventor(ReadUserInput());

    // Input elemek nullázása:
    Object.entries(InputElements).forEach(([key, elem]) => elem.value = "");
    SelectedInventor.Id = null;
    SelectedInventor.isEdit = false;

    //Vissza jelzés ürítése
    ResponsElement.innerHTML = "";
});


ResetButton.addEventListener("reset", () => {
    SelectedInventor.Id = null;
    SelectedInventor.isEdit = false;
});

document.addEventListener("DOMContentLoaded", ReadInventors);
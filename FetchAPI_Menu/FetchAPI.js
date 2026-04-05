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
    return NewCell;
}

function CreateButtonRef(Record = null, IsEditBt = false) {
    if(Record === null)
        throw new Error("Cannot create reffrence button without a refferenc (id).");
    const Button = document.createElement("button");
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
    .catch(Err => {
        ResponsElement.innerHTML += "<br>Error: Cannot load the inventors!";
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
            ResponsElement.innerHTML += "The new inventor is succesfully saved!";
            ReadInventors();
        }
    })
    .catch(Err => {
        ResponsElement.innerHTML = "Error: Cannot save the new inventor!";
        console.log("Create: " + Err.message);
    });
}

function DeleteInventor(Id) {
    if(!confirm("Are you sure you want to delete this inventor?")) return;
    console.log(Id);
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
            ResponsElement.innerHTML += "The selected inventor is succesfully deleted!";
            ReadInventors();
        }
    })
    .catch(Err => {
        ResponsElement.innerHTML = "Error: Cannot delete the selected inventor!";
        console.log("Delete: " + Err.message);
    });
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
            ResponsElement.innerHTML += "The selected inventor is succesfully updated!";
            ReadInventors();
        }
    })
    .catch(Err => {
        ResponsElement.innerHTML = "Error: Cannot update the selected inventor!";
        console.log("Update: " + Err.message);
    });
}


//Vezérlő gomb amivel interaktálunk a szerver fele:
SaveButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    // 1. Alapstílus beállítása (láthatóvá tétel)
    ResponsElement.style.display = "block";
    ResponsElement.style.padding = "15px";
    ResponsElement.style.marginBottom = "20px";
    ResponsElement.style.borderRadius = "5px";

    // 2. Művelet elindítása
    if(SelectedInventor.isEdit)
        UpdateInventor(SelectedInventor.Id);
    else 
        CreateInventor(ReadUserInput());

    // 3. Egy kis "időzített bomba" a stílushoz:
    // Megvárjuk, amíg a fetch beleírja az üzenetet, és aszerint színezzük
    setTimeout(() => {
        const text = ResponsElement.innerText.toLowerCase();
        
        if (text.includes("error") || text.includes("cannot")) {
            // PIROS, ha hiba van
            ResponsElement.style.backgroundColor = "#f8d7da";
            ResponsElement.style.color = "#721c24";
            ResponsElement.style.border = "1px solid #f5c6cb";
        } else {
            // ZÖLD, ha sikeres
            ResponsElement.style.backgroundColor = "#d4edda";
            ResponsElement.style.color = "#155724";
            ResponsElement.style.border = "1px solid #c3e6cb";
        }

        // 4. Eltüntetés 3 másodperc múlva
        setTimeout(() => {
            ResponsElement.style.display = "none";
            ResponsElement.innerHTML = "";
        }, 3000);

    }, 100); // 100ms várakozás, hogy a fetch válasza biztosan megérkezzen az innerHTML-be

    // Input elemek nullázása:
    Object.entries(InputElements).forEach(([key, elem]) => elem.value = "");
    SelectedInventor.Id = null;
    SelectedInventor.isEdit = false;
});


ResetButton.addEventListener("reset", () => {
    SelectedInventor.Id = null;
    SelectedInventor.isEdit = false;
});

document.addEventListener("DOMContentLoaded", ReadInventors);
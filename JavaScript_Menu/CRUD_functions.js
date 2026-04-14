/* Deklarációk:
Egy rekord kulcs érték páraba a következő:
    rekord = {
        Name: "Valaki",
        Born: 2032
        Died: 2045
    }
*/
//Rekord lista melybe teszük a lista példányokat:
let RecordList = [
    {Name: "Kühne Ede", Born: 1839, Died: 1903},
    {Name: "Déri Miksa", Born: 1854, Died: 1938},
    {Name: "Fejes Jenő", Born: 1877, Died: 1952},
    {Name: "Reich Ernő", Born: 1887, Died: 1965},
    {Name: "Bródy Imre", Born: 1891, Died: 1944},
];
//Az user álatal éppen Edit műveletre választott rekord indexe:
let SelectedState = {
    EditMode : false,
    Index: null
};
//Forms elemek:
const FormElements = {
    InputName: document.getElementById("InputName"),
    InputBorn: document.getElementById("InputBorn"),
    InputDied: document.getElementById("InputDied"),
    OutputElement: document.getElementById("OutputElement"),
    SubmitButton: document.getElementById("Submit"),
    ResetButton: document.getElementById("Reset")
};
//===================== Segéd függvények =====================
/*Feltételek:
-  név mező kötelező
-  szuletési mező kötelező
-  halál lehet null = nem kötelező
*/
//Ha java-ból kell validálni akkor azt itt kell:
function CheckIsValid() {
    if(FormElements.InputName.value !== "" && FormElements.InputName.value !== null)
        return true;
    return false;
}
//Új táblázat mező létrehozó függvény:
function NewCell(Value = null) {
    const NewDataCell = document.createElement("td");
    NewDataCell.textContent = "(null)";
    if(Value === null || Value === "")
        return NewDataCell;
    NewDataCell.textContent = Value;
    return NewDataCell;
}
function NewReferenc(Index, isEdit = false) {
    const NewButton = document.createElement("button");
    //A külön esemény kezelők azért kellenek mert akkor lehet eldönteni hogy mire hivatkozunk és a fő esemény kezelő hogyan fusson
    if(isEdit) {//Ha edit button van akkor más esemény kezelő fut és a szöveg is más
        NewButton.textContent = "Update";
        NewButton.addEventListener("click", () => {
            //------------------ ezt lehet bővíteni ha új oszlopok lesznek ------------------
            FormElements.InputName.value = RecordList[Index].Name;
            FormElements.InputBorn.value = RecordList[Index].Born;
            FormElements.InputDied.value = RecordList[Index].Died;
            //-------------------------------------------------------------------------------
            SelectedState.Index = Index;
            SelectedState.EditMode = true;
        });
        return NewButton;
    }
    NewButton.textContent = "Delete";
    NewButton.addEventListener("click", () => {
        DeleteRecord(Index);
        SelectedState.EditMode = false;
    });
    return NewButton;
}

function CreateRow(RowData, Index) {
    if(Index > RecordList.length) {
        console.error("Index out of range at CreateRow with: " + Index);
        return;
    }
    const NewTableRow = document.createElement("tr");
    //Manuálisan ide kell bevinni a cellák számát:
    //--------------Adatbázi szerint ----------------
    NewTableRow.appendChild(NewCell(RowData.Name));
    NewTableRow.appendChild(NewCell(RowData.Born));
    NewTableRow.appendChild(NewCell(RowData.Died));
    //-----------------------------------------------
    //Statikus lekezelése a button-oknak hiszen azok "mindig" ugyan azok:
    const ButtonCell = NewCell("");
    ButtonCell.innerHTML = "";
    ButtonCell.appendChild(NewReferenc(Index));
    ButtonCell.appendChild(NewReferenc(Index, true));

    NewTableRow.appendChild(ButtonCell);
    return NewTableRow;
}

//CRUD függvények:
//Jelen esetben csak az adott froms elemk kiolvasása:
function ReadInputStream() {
    let NewRecord = {
        Name: FormElements.InputName.value,
        Born: FormElements.InputBorn.value,
        Died: FormElements.InputDied.value
    };
    return NewRecord;
}
//Ez fel is veszi a rekordokat a html-be!!!
function ReadRecords() {
    FormElements.OutputElement.innerHTML = "";
    for(let index = 0; index < RecordList.length; index++)
        FormElements.OutputElement.appendChild(CreateRow(RecordList[index], index));
}
//Az inputról olvasás és kilistázás:
function CreateRecord() {
    if(CheckIsValid()) {
        RecordList.push(ReadInputStream());
        ReadRecords();
    }
}
//Törlés a listából és újra tölése:
function DeleteRecord(Index) {
    if(Index > RecordList.length) {
        console.error("Index out off range at Deleting a Record");
        return;
    }
    RecordList.splice(Index, 1);
    ReadRecords();
}
//Update-elés user inputból:
function UpdateRecord(Index) {
    if(Index > RecordList.length) {
        console.error("Index out off range at Deleting a Record");
        return;
    }
    if(CheckIsValid()) {
        RecordList[Index] = ReadInputStream();
        ReadRecords();
    }
}

//Ez ugye ami beküldi az adatokat:
FormElements.SubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    //Eldönétse hogy milyen fajta interakció volt:
    if(!SelectedState.EditMode) CreateRecord();
    else if(SelectedState.EditMode) {
        UpdateRecord(SelectedState.Index);
        SelectedState.Index = null;
        SelectedState.EditMode = false;
    }
    //A forms adatok törlése:
    FormElements.InputName.value = "";
    FormElements.InputBorn.value = "";
    FormElements.InputDied.value = "";
});
//Nulláza a mezőket (ha form lenne akkor ez autómata)
FormElements.ResetButton.addEventListener("click", () => {
    FormElements.InputName.value = "";
    FormElements.InputBorn.value = "";
    FormElements.InputDied.value = "";
});

//Inicializálás:
document.addEventListener("DOMContentLoaded", ReadRecords);
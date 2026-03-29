//Recordok objektumokként ábrázolva:
class Record {
    BelongsToTable = "";
    RowId = null;
    Data = {};
    constructor(RowId = null, Table = "") {
        if(!Number.isInteger(RowId) || Table === "" || Table === null)
            throw new Error("Cannot create a record which is not specified!");
        this.BelongsToTable = Table;
        this.RowId = RowId;
    }
    //Getterek:
    GetTableName() { return this.BelongsToTable; }
    GetColumnNames() {
        const Columns = Object.entries(this.Data).map(([key, value]) => key);
        return Columns;
    }

    CreateCell(Value) {
        const Cell = document.createElement("td");
        if(Value === null) {
            Cell.textContent = "(null)";
            return Cell;
        }
        Cell.textContent = Value;
        return Cell;
    }

    //HTML-re alakítás
    CreateRow() {
        const RowElement = document.createElement("tr");
        Object.entries(this.Data).map(([key, value]) => {
            RowElement.appendChild(this.CreateCell(value));
        });
        return RowElement;
    }
}

class Inventors extends Record {
    constructor(RowId = null, Table = "", Columns = [], InventorDescription = { Name: null, Born: null, Died: null}) {
        //Hiba kezelés:
        super(RowId, Table, Columns);
        if(InventorDescription === null)
            throw new Error("Cannot a create inventor which has no description");
        if(InventorDescription.Name === null || InventorDescription.Name === "")
            throw new Error("Cannot create a nameless inventor!");
        if(InventorDescription.Born === null || !Number.isInteger(InventorDescription.Born))
            throw new Error("Cannot create an inventor with an undefined Born data!");
        if(InventorDescription.Died && !Number.isInteger(InventorDescription.Died))
            throw new Error("Cannot create an inventor with a not correct date format!");
        //Adat feltöltés:
        this.Data.Name = InventorDescription.Name;
        this.Data.Born = InventorDescription.Born;
        this.Data.Died = InventorDescription.Died;
    }

    //Getterek:
    GetName() { return this.InventorData.Name; }
    GetBorn() { return this.InventorData.Born; }
    GetDied() { return this.InventorData.Died; }

    CalculateAge() { return this.InventorData.Died - this.InventorData.Died; }
}

//Fetch handler:
class HandleFetch {
    Path = "";
    TableToConnect = "";
    constructor(ServerPath = "", TableToConnect = "") {
        if(ServerPath === "" || ServerPath === null)
            throw new Error("Cannot open a connection stream to a server path which is not exists!");
        if(TableToConnect === "" || TableToConnect === null)
            throw new Error("Cannot open a connection stream to a Table which is not exists!");
        this.Path = ServerPath;
        this.TableToConnect = TableToConnect;
    }

    //Getterek:
    GetPath() { return this.Path; }
    GetTable() { return this.TableToConnect; }

    //Küld majd egy get üzenetet a szervernek:
    async TestConnection() {
        const Response = await fetch(this.Path+"?Test=test");
        if(Response !== null && Response.Fail === false)
            return true;
        return false;
    }

    async GetRecords(Specifictaion = { Column: "", Value: ""}) {
        if(Specifictaion === null || Specifictaion.Column === "" || Specifictaion.Column === null || Specifictaion.Value === "" || Specifictaion.Value === null) {
            const DataSet = await fetch(this.Path).then(resp => resp.json());
            if(DataSet.Fail)
                return null;
            return DataSet.Records;
        }
        const DataSet = await fetch(this.Path+"?Spec="+JSON.stringify(Specifictaion)).then(resp => resp.json());
        if(DataSet.Fail)
            return null;
        return DataSet.Records;
    }

    async SetRecord(Specifictaion = { id: null, NewData: null }) {
        if(Specifictaion === null || Specifictaion.id === null || !Number.isInteger(Specifictaion.id) || Specifictaion.NewData === null)
            throw new Error("The specifiaction was not propert, keep in mind that the id is a number and the Data has to be set.");
        //TODO: update funtion-t meg kell írni.
    }
    
    async DeleteRecord(Specifictaion = null) {
        if(Specifictaion === null || !Number.isInteger(Specifictaion))
            throw new Error("To delete this reccord there must be an id given to this methode, which is a number.");
        //TODO: delete funtion-t meg kell írni.
    }
}


class ObjectTable {
    TableName = "";
    /** @type {HTMLElement} */
    OutputElement = null;
    CountOfRecords = 0;
    /** @type {Record[]} */
    RecordList = [];

    constructor(TableName = "", OutputElement = null) {
        if(TableName === null || TableName === "")
            throw new Error("There must be a name of the table!");
        if(OutputElement === null)
            throw new Error("Cannot make a table handler without an output HTML element!");
        this.TableName = TableName;
        this.OutputElement = OutputElement;
    }
    
    //Ez legyen az én Record típusomnak megfelelő
    AddRecord(NewRecord) {
        if(NewRecord.GetTableName() !== this.TableName)
            throw new Error("Cannot load a(n) " + NewRecord.GetTableName() + " type of Record into a " + this.TableName + " table!");
        this.RecordList.push(NewRecord);
        this.CountOfRecords += 1;
    }
    ClearList() { this.RecordList = []; this.CountOfRecords = 0; }
    //Vizualitás:
    Show() {
        this.RecordList.forEach((Rec, num) => {
            this.OutputElement.appendChild(Rec.CreateRow());
        });
    }
}
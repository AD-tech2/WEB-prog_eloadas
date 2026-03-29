//Recordok objektumokként ábrázolva:
/**@abstract */
class AbstractRecord {
    /** @protected @type {String}*/
    BelongsToTable = "";
    /** @protected @type {Number}*/
    RowId = null;
    /** @protected @type {Object} */
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
    GetRowId() { return this.RowId; }

    /**@private */
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
        //Azért teszem ide hogy nelegyen publikus függvény
        const RowElement = document.createElement("tr");
        Object.entries(this.Data).map(([key, value]) => {
            RowElement.appendChild(this.CreateCell(value));
        });
        return RowElement;
    }
}

class Inventor extends AbstractRecord {
    constructor(RowId = null, Table = "", InventorDescription = { Name: null, Born: null, Died: null}) {
        //Hiba kezelés:
        super(RowId, Table);
        if(InventorDescription === null)
            throw new Error("Cannot a create inventor which has no description");
        if(InventorDescription.Name === null || InventorDescription.Name === "")
            throw new Error("Cannot create a nameless inventor!");
        if(InventorDescription.Born === null)
            throw new Error("Cannot create an inventor with an undefined Born data!");
        //Adat feltöltés:
        this.Data.Name = InventorDescription.Name;
        this.Data.Born = InventorDescription.Born;
        this.Data.Died = InventorDescription.Died;
    }

    //Getterek:
    GetName() { return this.Data.Name; }
    GetBorn() { return this.Data.Born; }
    GetDied() { return this.Data.Died; }

    //Művelet függvények:
    CalculateAge() { return this.Data.Died - this.Data.Died; }
    /** @virtual */
    ToString() {
        return "Name: " + this.Data.Name + ", Born: " + this.Data.Born + ", Died: " + this.Data.Died;
    }
}

class InputHandler {
    /** @protected @type {Object}*/
    Elements = null;

    constructor(References) {
        if(References === null)
            throw new Error("Cannot make a input stream for nothing!");
        this.Elements = References;
        
    }
    ReadInput() {
        const ResultSet = structuredClone(this.Elements);
        Object.entries(this.Elements).map(([key, elem]) => {
            ResultSet[key] = document.getElementById(elem).value;
        });
        return ResultSet;
    }
    /** @param {String} ValueToSet  */
    SetInput(ValueToSet) {
        Object.entries(this.Elements).map(([key, elem]) => { document.getElementById(elem).value = ValueToSet; });
    }
    Clear() { this.SetInput(""); }
}

class OutputHandler {
    /** @protected @type {String} */
    TableName = "";
    /** @protected @type {HTMLElement} */
    OutputElement = null;
    /** @protected @type {AbstractRecord[]} */
    RecordList = [];

    /**@type {{ Update(Number): void, Delete(Number): void }} */
    EventHandlers = null;

    /** @param {HTMLElement} OutputElement @param {{ Update(Number): void, Delete(Number): void }} [EventHandlers=null] */
    constructor(TableName = "", EventHandlers = null, OutputElement) {
        if(TableName === null || TableName === "")
            throw new Error("There must be a name of the table!");
        if(OutputElement === null)
            throw new Error("Cannot make a table handler without an output HTML element!");
        this.TableName = TableName;
        this.OutputElement = OutputElement;
        if(EventHandlers !== null)
            this.EventHandlers = EventHandlers;
    }
    
    //Ez legyen az én Record típusomnak megfelelő
    /**@param {AbstractRecord} NewRecord  */
    AddRecord(NewRecord) {
        if(NewRecord.GetTableName() !== this.TableName)
            throw new Error("Cannot load a(n) " + NewRecord.GetTableName() + " type of Record into a " + this.TableName + " table!");
        this.RecordList.push(NewRecord);
    }

    //Csak referencia csere és Count ürítés
    ClearList() { this.RecordList = []; }

    /**@private @param {Number} Id */
    CreateRefBtn(Id, Name, EventHandler) {
        const Button = document.createElement("button");
        Button.textContent = Name;
        Button.addEventListener("click", () => EventHandler(Id));
        return Button;
    }

    /**@private @param {Number} Id */
    CreateRef(Id) {
        const Cell = document.createElement("td");
        Object.entries(this.EventHandlers).forEach(([key, handler]) => {
            Cell.appendChild(this.CreateRefBtn(
                Id,
                key,
                handler
            ));
        });
        return Cell;
    }

    //Vizualitás megjelenítni a rekordot az ős függvényével:
    Show() {
        if(this.EventHandlers !== null) this.RecordList.forEach((Rec, num) => {
            const Row = Rec.CreateRow();
            Row.appendChild(this.CreateRef(Rec.GetRowId()));
            this.OutputElement.appendChild(Row);
        });
        else this.RecordList.forEach((Rec, num) => {
            this.OutputElement.appendChild(Rec.CreateRow());
        });
    }
    
    //Csak HTML ürítése:
    Hide() { this.OutputElement.innerHTML = ""; }

    //Egszerűen ürítem a HTML-t és után újre töltöm:
    Refreash() { this.Hide(); this.Show(); }

    //Count getter visszaadja lista hoszát:
    Count() { return this.RecordList.length; }
}
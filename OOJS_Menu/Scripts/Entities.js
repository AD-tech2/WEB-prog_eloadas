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
    GetData() { return this.Data; }
    SetData(NewData) { this.Data = NewData; }
    /**@abstract */
    static GetAttrNames() { }

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
    /**@override */
    static GetAttrNames() { return ["Name", "Born", "Died"]; }

    //Művelet függvények:
    CalculateAge() { return this.Data.Died - this.Data.Died; }
    /** @virtual */
    ToString() {
        return "Name: " + this.Data.Name + ", Born: " + this.Data.Born + ", Died: " + this.Data.Died;
    }
}
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

    /**@protected */
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
    /**@virtual */
    CreateRow() {
        const RowElement = document.createElement("tr");
        Object.entries(this.Data).map(([key, value]) => {
            if(value === "" || value === null)
                RowElement.appendChild(this.CreateCell("(null)"));
            else RowElement.appendChild(this.CreateCell(value));
        });
        return RowElement;
    }

    /**@virtual */
    ToString() {
        return "No specific defined!";
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
    /**@override */
    ToString() {
        return "Name: " + this.Data.Name + ", Born: " + this.Data.Born + ", Died: " + this.Data.Died;
    }
}

class Invention extends AbstractRecord {
    constructor(RowId = null, Table = "", InventionDescription = { Name: null }) {
        //Hiba kezelés:
        super(RowId, Table);
        if(InventionDescription === null)
            throw new Error("Cannot a create invention which has no description");
        if(InventionDescription.Name === null || InventionDescription.Name === "")
            throw new Error("The given name is not valid!");
        this.Data = InventionDescription.Name;
    }

    //Getter:
    GetName() { return this.Data.Name; }

    /**@override */
    static GetAttrNames() {
        return ["Name"];
    }

    /**@override */
    CreateRow() {
        const RowElement = document.createElement("tr");
        RowElement.appendChild(this.CreateCell(this.Data));
        return RowElement;
    }

    /**@override */
    ToString() {
        return "Name: " + this.Data.Name;
    }
}
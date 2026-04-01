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
    /**@param {AbstractRecord} Record  */
    Clear() { this.SetInput(""); }

    /**@param {AbstractRecord} Record  */
    LoadIntoInput(Record) {
        //TODO: Ezt bug fix-elni kell!
        if(Record === null)
            throw new Error("The given data is null!");
        try {
            const Data = Record.GetData();
            Object.entries(this.Elements).forEach(([key, elem]) => {
                document.getElementById(elem).value = Data[key];
            });
        } catch(error) {
            throw new Error("The given Record is not similar with the input elements!");
        }
    }
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

    /** @param {String} OutputElement @param {{ Update(Number): void, Delete(Number): void }} [EventHandlers=null] */
    constructor(TableName = "", EventHandlers = null, OutputElement) {
        if(TableName === null || TableName === "")
            throw new Error("There must be a name of the table!");
        if(OutputElement === null)
            throw new Error("Cannot make a table handler without an output HTML element!");
        this.TableName = TableName;
        this.OutputElement = document.getElementById(OutputElement);
        if(EventHandlers !== null)
            this.EventHandlers = EventHandlers;
    }
    
    GetRecordById(Id) {
        for(const Record of this.RecordList) {
            if(Record.GetRowId() === Id)
                return Record;
        }
        return null;
    }

    //Ez legyen az én Record típusomnak megfelelő
    /**@param {AbstractRecord} NewRecord  */
    AddRecord(NewRecord) {
        if(NewRecord.GetTableName() !== this.TableName)
            throw new Error("Cannot load a(n) " + NewRecord.GetTableName() + " type of Record into a " + this.TableName + " table!");
        this.RecordList.push(NewRecord);
    }

    /**@param {Number} Id  */
    RemoveRecord(Id) {
        if(Id === null)
            throw new Error("Invalid Id given!");
        this.RecordList = this.RecordList.filter(Record => Record.GetRowId() != Id);
    }
    /**@param {Number} Id */
    UpdateRecord(Id, NewData) {
        if(Id === null)
            throw new Error("Invalid Id given!");
        const Record = this.GetRecordById(Id);
        if(Record !== null) {
            Record.SetData(NewData);
            return;
        }
        throw new Error("The specifed index cannot be found in the output element!");
    }

    //Csak referencia csere és Count ürítés
    ClearList() { this.RecordList = []; }

    /**@private @param {Number} Id */
    CreateRefBtn(Id, Name, EventHandler) {
        const Button = document.createElement("button");
        Button.textContent = Name;
        if(EventHandler != null)
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
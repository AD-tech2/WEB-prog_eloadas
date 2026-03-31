class ObjectTable {
    /** @protected @type {HTMLElement} */
    TableRef = null;
    /** @private @type {HTMLTableSectionElement}*/
    TableHead = null;
    /** @protected @type {OutputHandler}*/
    Output = null;
    /** @param {String} RefName @param {String[]} ColumnList  @param {OutputHandler} ConfigedOutput */
    constructor(RefName, ColumnList, ConfigedOutput) {
        if(RefName === "" || RefName === null)
            throw new Error("There is no assigned container element!");
        try {
            if(ColumnList === null || ColumnList.length > 0 || ConfigedOutput === null || ConfigedOutput.Count() !== null) {
                this.TableRef = document.getElementById(RefName);
                this.Output = ConfigedOutput;
            }
            if(this.TableRef.getElementsByTagName("thead").length === 0)
                this.CreateThead();
            else this.TableHead = this.TableRef.getElementsByTagName("thead").item(0);
            this.LoadColumns(ColumnList);
        } catch(error) {
            console.log("Configuration error at Output: " + error.message);
            throw new Error("The Output is not configured properly!");
        }
    }

    /**@private */
    CreateThead() {
        this.TableHead = document.createElement("thead");
        this.TableRef.appendChild(this.TableHead);
    }

    /**@private */
    CreateColumn(Name) {
        const Cell = document.createElement("th");
        Cell.textContent = Name;
        return Cell;
    }

    /**@protected @param {String[]} Exemple */
    LoadColumns(Exemple) {
        this.TableHead.innerHTML = "";
        Exemple.map(cols => this.TableHead.appendChild(
            this.CreateColumn(cols)
        ));
    }
}
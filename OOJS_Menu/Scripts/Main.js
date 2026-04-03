//InputHandler object azér felel hogy az input interakciók egyszerűbbeke legyenek
const Input = new InputHandler({
    Name: "InputName",
    Born: "InputBorn",
    Died: "InputDied"
});

//Működéshez szükséges globális változók/Flag-ek:
let i = 0;
const UpdateTarget = {
    Id: null,
    IsUpdating: false
};

const Output = new OutputHandler(
    "Talalmanyok",
    {
        Delete: (id) => { if(!confirm("Are you sure?")) return;
                          Output.RemoveRecord(id); Output.Refreash();
                          UpdateTarget.Id = null; UpdateTarget.IsUpdating = false;
                        },
        Update: (id) => { UpdateTarget.Id = id; UpdateTarget.IsUpdating = true;
                          Input.LoadIntoInput(Output.GetRecordById(id));
                        }
    },
    "OutputElement"
);

const ObjTable = new ObjectTable(
    "ObjectTable",
    ["Név", "Születési Dátum", "Halálozási Dátum", "Műveletek"],
    Output
);

document.getElementById("Submit").addEventListener("click", (event) => {
    event.preventDefault();
    if(UpdateTarget.IsUpdating)
        Output.UpdateRecord(
            UpdateTarget.Id,
            Input.ReadInput()
        );
    else Output.AddRecord(new Inventor(
        i++,
        "Talalmanyok",
        Input.ReadInput()
    ));
    UpdateTarget.Id = null;
    UpdateTarget.IsUpdating = false;
    Output.Refreash();
    Input.Clear();
});

document.getElementById("Reset").addEventListener("click", (event) => {
    event.preventDefault();
    UpdateTarget.Id = null;
    UpdateTarget.IsUpdating = false;
    Input.Clear();
});
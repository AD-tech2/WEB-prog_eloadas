//InputHandler object azér felel hogy az input interakciók egyszerűbbeke legyenek
const Input = new InputHandler({
    Name: "InputName",
    Born: "InputBorn",
    Died: "InputDied"
});

let i = 0;
const UpdateTarget = {
    Id: null,
    IsUpdating: false
};

const Output = new OutputHandler(
    "Kutatok", {
        Delete: (id) => { Output.RemoveRecord(id); Output.Refreash();
                          UpdateTarget.Id = null; UpdateTarget.IsUpdating = false; 
                        },
        Update: (id) => { UpdateTarget.Id = id; UpdateTarget.IsUpdating = true;
                          Input.LoadInto(Output.GetRecordById(id));
                        }
    },
    document.getElementById("OutputElement")
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
        "Kutatok",
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
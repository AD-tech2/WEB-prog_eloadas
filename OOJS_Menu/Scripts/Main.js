//InputHandler object azér felel hogy az input interakciók egyszerűbbeke legyenek
const Input = new InputHandler({
    Name: "InputName",
    Born: "InputBorn",
    Died: "InputDied"
});

const Output = new OutputHandler(
    "Kutatok", {
        Delete: (id) => { console.log("Delete: "+ id)},
        Update: (id) => { console.log("Update: " + id)}
    },
    document.getElementById("OutputElement")
);

let i = 0;
document.getElementById("Submit").addEventListener("click", () => {
    Output.AddRecord(new Inventor(
        i++,
        "Kutatok",
        Input.ReadInput()
    ));
    Output.Refreash();
    Input.Clear();
});
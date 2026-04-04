export function InputElement({InputElements = []}) {
  if(InputElements.length === 0) throw new Error("Error: There should be one parameter.");
  return(
    <>
      {InputElements.map((Input) => {
          return (
            <label key={Input.id}>
              {Input.text} <br/>
              <input type={Input.inputType} ref={Input.ref}/> <br/>
            </label>
          );
      })}
    </>
  );
}

export function DefineColumns({Columns = []}) {
  if(Columns.length === 0) throw new Error("Error: The Column list is null.");
  return (
    <thead>
      <tr>
        {Columns.map((Column, key) => {
          return <th key={key}>{Column}</th>
        })}
      </tr>
    </thead>
  );
}

function Record({RecordData, FunctionSet = []}) {
  if(RecordData === null) throw new Error("Unable to create an empty data row.");
  return (
    <tr>
      {Object.entries(RecordData).map(([key, value]) => {
        if(key !== "Id") return <td key={key}>{value === "" ? "(null)" : value}</td>
      })}
      <td>
        <button key={"Delete"} onClick={() => FunctionSet.Delete(RecordData.Id)}>Delete</button>
        <button key={"Update"} onClick={() => FunctionSet.Update((value) => {
          const temp = Object.entries(RecordData).filter(d => d[0] != "Id");
          let i = 0;
          value.RefList.map((ref) => {
            ref.current.value = temp[i++][1];
          });
          return { Id: RecordData.Id, State: true, RefList: value.RefList};
        })}>Update</button>
      </td>
    </tr>
  );
}

export function DefineOutput({DataSet = [], FunctionSet = []}) {
  if(DataSet === null) throw new Error("Unable to load output, because it is null.");
  return (
    <tbody>
      {DataSet.map((RecordData, key) => {
        return <Record key={key} RecordData={RecordData} FunctionSet={FunctionSet}/>;
      })}
    </tbody>
  );
}
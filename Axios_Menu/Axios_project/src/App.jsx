import { useEffect, useRef, useState } from "react"
import FormElement from "./Components/FormInput"
import TableElement from "./Components/TableOutput"
import { ReadInventors, ReadUserInput } from "./CRUD_functions/ReadStream";
import { DeleteInventor, UpdateInventor, CreateInventor } from "./CRUD_functions/ManipStream";

function App() {
  //Összesen van 3 input elem (Név, Születés, Halálozás) = 3 db referencia:
  const InputRefs = {
    Name: useRef(null),
    Born: useRef(null),
    Died: useRef(null)
  };
  //Update esemény flagek:
  const UpdateFlag = useRef({
    IsUpdate: false,
    Id: null
  });
  const SetUpdateFlag = (NewConfig = {IsUpdate: null, Id: null}) => {
    UpdateFlag.current.IsUpdate = NewConfig.IsUpdate;
    UpdateFlag.current.Id = NewConfig.Id;
  }
  const GetUpdateFlag = () => { return UpdateFlag.current; }

  //Ref amibe töltünk render nélkül hogy legyen idő betölteni az adatotkat:
  const RecordList = useRef([]);
  const GetRecords = () => { return RecordList.current; }
  const SetRecords = (RecList) => { RecordList.current = RecList; }

  //Az error állításával triggerel a render:
  const [Error, SetError] = useState({
    Flag: false,
    Message: ""
  });

  //Kezelő metódusok:
  const LoadRecords = async () => {
    const Data = await ReadInventors("http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php");
    if(Data.Fail) {
      SetError({
        Flag: true,
        Message: "Unable to load in the inventors!"
      });
      return;
    }
    SetRecords(Data.Records);
    SetError({
      Flag: false,
      Message: ""
    });
  };

  //================================================ CRUD implementációk erre a táblára ===========================================
  const CreateRecord = async (Handler, NewRecord) => {
    const Data = await CreateInventor(Handler, NewRecord);
    console.log(Data);
    if(Data.Fail) {
      SetError({
        Flag: true,
        Message: "Unable to create a new inventor!"
      });
      return;
    }
    LoadRecords();
    SetError({
      Flag: false,
      Message: ""
    });
  }

  const DeleteRecord = async (Handler, Id) => {
    const Data = await DeleteInventor(Handler, Id);
    if(Data.Fail) {
      SetError({
        Flag: true,
        Message: "Unable to delete the selected inventor!"
      });
      return;
    }
    LoadRecords();
    SetError({
      Flag: false,
      Message: ""
    });
  }

  const UpdateRecord = async (Handler, Id, NewRecord) => {
    const Data = await UpdateInventor(Handler, Id, NewRecord);
    if(Data.Fail) {
      SetError({
        Flag: true,
        Message: "Unable to update the selected inventor!"
      });
      return;
    }
    LoadRecords();
    SetError({
      Flag: false,
      Message: ""
    });
  }
  //=======================================================================================================================================

  //Interaktáló gomb esememény kezelője:
  const HandleSave = () => {
    //Ha update esemény van jelen akkor kerül ide a vezérlés:
    if(GetUpdateFlag().IsUpdate) {
      UpdateRecord("http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php", GetUpdateFlag().Id, ReadUserInput(InputRefs));
      SetUpdateFlag({
        IsUpdate: false,
        Id: null
      });
    }
    //Ha nem Update esemény kell akkor új elemet veszünk fel:
    else CreateRecord("http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php", ReadUserInput(InputRefs));
    //Ref-ek nullázása:
    Object.entries(InputRefs).map(([key, inputs]) => { inputs.current.value = ""; });
  }

  //Default load esemény:
  useEffect(() => LoadRecords, []);

  //"http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php" nálam ez volt a szerver php kezelő program címe, ha nálad nem akkor EDITELD!!!!
  return (
    <>
      <h1>React + PHP CRUD alkalmazás</h1>
      { Error &&
        <h3>
          {Error.Message}
        </h3>
      }
      <FormElement ListOfInputConfs={[
        {label: "Név*", type: "text", holder: "Pl.: Jóska Pista", ref: InputRefs.Name},
        {label: "Életkor*", type: "number", holder: "Pl.: 1995", ref: InputRefs.Born},
        {label: "Halálozás", type: "number", holder: "Pl.: 2020", ref: InputRefs.Died}
      ]}/>
      <button onClick={() => {HandleSave();}}>Save</button>
      { GetRecords().length > 0 &&
        <TableElement
          ColumnNames={["Név", "Születés", "Halálozás", "Műveletek"]}
          Records={GetRecords()}
          HandlerCollection={{
            Handler: "http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php",
            Refs: InputRefs,
            Delete: DeleteRecord,
            Update: SetUpdateFlag
          }}
        />
      }
      { (GetRecords().length === 0 || GetRecords() === null) &&
        <TableElement 
          ColumnNames={["Név", "Születés", "Halálozás", "Műveletek"]}
          Records={[]}
        />
      }
    </>
  )
}

export default App

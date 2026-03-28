import { useEffect, useRef, useState } from "react"
import FormElement from "./Components/FormInput"
import TableElement from "./Components/TableOutput"
import { ReadInventors, ReadSpecificInventor, ReadUserInput } from "./CRUD_functions/ReadStream";
import { DeleteInventor, UpdateInventor, CreateInventor } from "./CRUD_functions/ManipStream";
import SearchBar from "./Components/SearchBar";
import './style.css';

function App() {
  //Összesen van 3 input elem (Név, Születés, Halálozás) = 3 db referencia:
  const InputRefs = {
    Name: useRef(null),
    Born: useRef(null),
    Died: useRef(null)
  };
  //Adatok egy ref-ben:
  const RecordList = useRef([]);
  const GetRecordList = () => RecordList.current;
  const SetRecordList = (NewRecords) => { RecordList.current = NewRecords; }

  //Update esemény flagek:
  const [UpdateFlag, SetUpdateFlag] = useState({
    IsUpdate: false,
    Id: null
  });

  //Az error állításával triggerel a render:
  const [Error, SetError] = useState({
    Flag: false,
    Message: ""
  });

  //Kezelő metódusok:
  const LoadRecords = async () => {
    const Data = await ReadInventors("http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php");
    if(Data === null || Data.Fail) {
      SetError({
        Flag: true,
        Message: "Unable to load in the inventors!"
      });
      return;
    }
    if(Data.Records === null) {
      SetError({
        Flag: true,
        Message: "Unable to load in the inventors!"
      });
      SetRecordList([]);//Üres listát ad szóval semmit nem tölt be lokálisan.
      return;
    }
    SetRecordList(Data.Records);//Ideiglenes tárolás
    SetError({
      Flag: false,
      Message: ""
    });
  }

  const LoadSpecRecords = async (Specification = { Column: null, Value: null}) => {
    if(Specification === null || Specification.Column === null || Specification.Column === "" || Specification.Value === "" || Specification.Value === null) {
      SetError({
        Flag: true,
        Message: "Cannot load a not specifyed data!"
      });
      return;
    }
    const Data = await ReadSpecificInventor("http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php", Specification);
    if(Data === null || Data.Fail) {
      SetError({
        Flag: true,
        Message: "Unable to load in the inventors!"
      });
      return;
    }
    if(Data.Records === null) {
      SetError({
        Flag: true,
        Message: "Unable to load in the inventors!"
      });
      SetRecordList([]);//Üres listát ad szóval semmit nem tölt be lokálisan.
      return;
    }
    SetRecordList(Data.Records);//Ideiglenes tárolás
    SetError({
      Flag: false,
      Message: ""
    });
  }

  //================================================ CRUD implementációk erre a táblára ===========================================
  const CreateRecord = async (Handler, NewRecord) => {
    const Data = await CreateInventor(Handler, NewRecord);
    if(Data === null || Data.Fail) {
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
    if(Data === null || Data.Fail) {
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
    if(Data === null || Data.Fail) {
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
    if(UpdateFlag.IsUpdate) {
      UpdateRecord("http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php", UpdateFlag.Id, ReadUserInput(InputRefs));
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

  const HandleReset = () => {
    Object.entries(InputRefs).map(([key, inputs]) => inputs.current.value = "");//ref-ek ürítése
    SetUpdateFlag({
      IsUpdate: false,
      Id: null
    });
  }

  //Default load események:
  useEffect(() => LoadRecords, [UpdateFlag]);

  useEffect(() => {
    if(!Error.Flag)//Ha sikeres a betöltés ürítjük a memóriát!
      SetRecordList([]);
  }, [Error]);

  //"http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php" nálam ez volt a szerver php kezelő program címe, ha nálad nem akkor EDITELD!!!!
  return (
    <>
      <h1>React + PHP CRUD alkalmazás</h1>
      { Error.Flag &&
        <h3>
          {Error.Message}
        </h3>
      }
      <SearchBar
        Label="SearchBar"
        OptionsToSearch={["nev", "születési dátum", "halálozási dátum"]}
        OnSearch={LoadSpecRecords}
        OnNullSearch={LoadRecords}
      />
      <FormElement
        ListOfInputConfs={[
          {label: "Név*", type: "text", holder: "Pl.: Makai Andor", ref: InputRefs.Name, notnull: true},
          {label: "Születés*", type: "number", holder: "Pl.: 1995", ref: InputRefs.Born, notnull: true},
          {label: "Halálozás", type: "number", holder: "Pl.: 2020", ref: InputRefs.Died}
        ]}
        OnSave={HandleSave}
        OnReset={{
          Available: UpdateFlag.IsUpdate,
          Reseter: HandleReset
        }}
      />
      <TableElement
        ColumnNames={["Név", "Születés", "Halálozás", "Műveletek"]}
        Records={GetRecordList()}
        HandlerCollection={{
          Handler: "http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php",
          Refs: InputRefs,
          Delete: DeleteRecord,
          Update: SetUpdateFlag
        }}
      />
    </>
  )
}

export default App

import { useEffect, useRef, useState } from "react"
import FormElement from "./Components/FormInput"
import TableElement from "./Components/TableOutput"
import { ReadInventors, ReadUserInput } from "./CRUD_functions/ReadStream";
import { DeleteInventor, UpdateInventor, CreateInventor } from "./CRUD_functions/ManipStream";
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
  const UpdateFlag = useRef({
    IsUpdate: false,
    Id: null
  });
  const SetUpdateFlag = (NewConfig = { IsUpdate: null, Id: null }) => {
    UpdateFlag.current.IsUpdate = NewConfig.IsUpdate;
    UpdateFlag.current.Id = NewConfig.Id;
  }
  const GetUpdateFlag = () => { return UpdateFlag.current; }

  //Az error állításával triggerel a render:
  const [Error, SetError] = useState({
    Flag: false,
    Message: ""
  });

  //Kezelő metódusok:
  const LoadRecords = async () => {
    const Data = await ReadInventors("http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php");
<<<<<<< HEAD
    if (Data.Fail) {
=======
    if(Data === null || Data.Fail) {
>>>>>>> 0d0495ce49ab50e151b08a87a68ffb688d03f9c3
      SetError({
        Flag: true,
        Message: "Unable to load in the inventors!"
      });
      return;
    }
    if(Data.Records === null || Data.Records.length === 0) {
      SetError({
        Flag: true,
        Message: "Unable to load in the inventors!"
      });
      LoadWrapper();//Üres listát ad szóval semmit nem tölt be lokálisan.
      return;
    }
    SetRecordList(Data.Records);//Ideiglenes tárolás
    SetError({
      Flag: false,
      Message: ""
    });
  };

  //================================================ CRUD implementációk erre a táblára ===========================================
  const CreateRecord = async (Handler, NewRecord) => {
    const Data = await CreateInventor(Handler, NewRecord);
<<<<<<< HEAD
    console.log(Data);
    if (Data.Fail) {
=======
    if(Data === null || Data.Fail) {
>>>>>>> 0d0495ce49ab50e151b08a87a68ffb688d03f9c3
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
<<<<<<< HEAD
    if (Data.Fail) {
=======
    if(Data === null || Data.Fail) {
>>>>>>> 0d0495ce49ab50e151b08a87a68ffb688d03f9c3
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
<<<<<<< HEAD
    if (Data.Fail) {
=======
    if(Data === null || Data.Fail) {
>>>>>>> 0d0495ce49ab50e151b08a87a68ffb688d03f9c3
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
    if (GetUpdateFlag().IsUpdate) {
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

  useEffect(() => {
    if(!Error.Flag)//Ha sikeres a betöltés ürítjük a memóriát!
      SetRecordList([]);
  }, [Error]);

  //"http://localhost/PHPGyakorlas/Axios_Menu/HandleRequest.php" nálam ez volt a szerver php kezelő program címe, ha nálad nem akkor EDITELD!!!!
  return (
    <div className="main-container"> {/* <--- Ez az új tároló div */}
      <h1>React + PHP CRUD alkalmazás</h1>
      {Error && Error.Flag && // Kis javítás: csak akkor írjuk ki, ha van Flag
        <h3 className="error-msg"> {/* <--- Class hozzáadva */}
          {Error.Message}
        </h3>
      }
<<<<<<< HEAD
      <div className="form-card"> {/* <--- Ez fogja össze a formot a CSS-ben */}
        <FormElement ListOfInputConfs={[
          { label: "Név*", type: "text", holder: "Pl.: Jóska Pista", ref: InputRefs.Name },
          { label: "Életkor*", type: "number", holder: "Pl.: 1995", ref: InputRefs.Born },
          { label: "Halálozás", type: "number", holder: "Pl.: 2020", ref: InputRefs.Died }
        ]} />
        <button className="save-btn" onClick={() => { HandleSave(); }}>Save</button> {/* <--- Class hozzáadva */}
      </div>

      <div className="table-container"> {/* <--- Táblázat tároló */}
        {GetRecords().length > 0 &&
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
        {(GetRecords().length === 0 || GetRecords() === null) &&
          <TableElement
            ColumnNames={["Név", "Születés", "Halálozás", "Műveletek"]}
            Records={[]}
          />
        }
      </div>
    </div>
=======
      <FormElement
        ListOfInputConfs={[
          {label: "Név*", type: "text", holder: "Pl.: Jóska Pista", ref: InputRefs.Name, notnull: true},
          {label: "Életkor*", type: "number", holder: "Pl.: 1995", ref: InputRefs.Born, notnull: true},
          {label: "Halálozás", type: "number", holder: "Pl.: 2020", ref: InputRefs.Died}
        ]}
        OnSave={HandleSave}
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
>>>>>>> 0d0495ce49ab50e151b08a87a68ffb688d03f9c3
  )
}

export default App

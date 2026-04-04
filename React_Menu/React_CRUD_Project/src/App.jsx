import { useEffect, useRef, useState } from 'react'
import { InputElement, DefineColumns, DefineOutput } from './Elements'
import "./style.css";

function App() {
  //Referencia a bementre(Ha bővíteni kell akkor ide kell majd új referencia!):
  const NameRef = useRef(null);
  const BornRef = useRef(null);
  const DiedRef = useRef(null);
  //Autómata indexelő referencia:
  const IndexRef = useRef(0);
  //Az update állapotot el kell tárolni valahol és átadni a külső kompononsnek:
  const [Updater, setUpdater] = useState({
    Id: null,
    State: false,
    RefList: [NameRef, BornRef, DiedRef]
  });

  //A rekordokat tároló state(Ez vezérli a renderelést):
  const [Records, setRecords] = useState([]);

  //Első 10 rekord betöltése első rendernél:
  useEffect(() => {
    setRecords([
      { Id: 40,	Name: "Kühne Ede",	Born: 1839, Died: 1903 },
      { Id: 14,	Name: "Déri Miksa",	Born: 1854,	Died: 1938 },
      { Id: 16,	Name: "Fejes Jenő",	Born: 1877,	Died: 1952 },
      { Id: 56,	Name: "Reich Ernő",	Born: 1887,	Died: 1965 },
      { Id: 10,	Name: "Bródy Imre",	Born: 1891,	Died: 1944 },
      { Id: 3,	Name: "Bay Zoltán",	Born: 1900,	Died: 1992 },
      { Id: 72,	Name: "Teller Ede",	Born: 1908,	Died: 2003 },
      { Id: 6,	Name: "Bárczy Pál",	Born: 1941, Died: "" },
      { Id: 5,	Name: "Bánki Donát", Born: 1859,	Died: 1922 },
      { Id: 33,	Name: "Just Sándor", Born: 1874,	Died: 1937 },
      { Id: 52,	Name: "Pogány Béla", Born: 1887,	Died: 1943 }
    ]);
  }, []);

  function CreateRecord() {
    setRecords([
      ... Records, {
        Id: IndexRef.current,
        Name: NameRef.current.value,
        Born: BornRef.current.value,
        Died: DiedRef.current.value
      }
    ]);
    IndexRef.current += 1;
  }
  function DeleteRecord(Id) {
    if(confirm("Are you sure?"))
      setRecords(Records.filter(r => r.Id !== Id));//Minden más kivéve az Id megtartása
    //Az adatok törlése az input mezőkből és Visszaállítás megvalósítása a HandleReset-el
    HandleReset();
  }
  function UpdateRecord(Id) {
    setRecords(Records.map((r) => {
      if(r.Id === Id)//ha az id egyezik => frissítése a rekordnak
        return {
          Id: Id,
          Name: NameRef.current.value,
          Born: BornRef.current.value,
          Died: DiedRef.current.value
        };
      else return r;
    }))
  }
  //Submit esemény függvénye:
  function HandleSubmit() {
    if(Updater.State)
      UpdateRecord(Updater.Id);//Itt történi a valódi érték változtatás
    else
      CreateRecord();//Csak input elemek kiolvasása és frissítése a listának
    //referenciák ürétése:
    NameRef.current.value = "";
    BornRef.current.value = "";
    DiedRef.current.value = "";
  }
  
  function HandleReset() {
    NameRef.current.value = "";
    BornRef.current.value = "";
    DiedRef.current.value = "";
    setUpdater({
      Id: null,
      State: false,
      RefList: [NameRef, BornRef, DiedRef]
    });
  }

  return (
    <>
      <h1>React CRUD</h1>
      { Updater.State &&
        <h2>Updating</h2>
      }
      <form onSubmit={(e) => {e.preventDefault()}}>
        <InputElement InputElements={[
          {id: 1, text: "Teljes név", inputType: "text", ref: NameRef},
          {id: 2, text: "Születési Dátum", inputType: "number", ref: BornRef},
          {id: 3, text: "Halálozási Dátum", inputType: "number", ref: DiedRef}
        ]}/>
        <br/>
        <button type="submit" onClick={HandleSubmit}>Send</button>
        { Updater.State &&
          <button type="reset" onClick={HandleReset}>Reset</button>
        }
      </form>
      <table>
        <DefineColumns Columns={[
          "Teljes név",
          "Születési dátum",
          "Halálozási dátum",
          "Operations"
        ]}/>
        <DefineOutput DataSet={Records} FunctionSet={{Delete: DeleteRecord, Update: setUpdater}}/>
      </table>
    </>
  )
}

export default App

import { useRef, useState } from "react"
import FormElement from "./Components/FormInput"
import TableElement from "./Components/TableOutput"

function App() {
  //Összesen van 3 input elem (Név, Születés, Halálozás) = 3 db referencia:
  const NameRef = useRef("");
  const BornRef = useRef(0);
  const DiedRef = useRef(0);

  //State változa amivel lehet triggerelni a load-ot:
  const [Reqest, SetRequest] = useState();

  return (
    <>
      <h1>React + PHP CRUD alkalmazás</h1>
      <FormElement ListOfInputConfs={[
        {label: "Név*", type: "text", holder: "Pl.: Jóska Pista", ref: NameRef},
        {label: "Életkor*", type: "number", holder: "Pl.: 1995", ref: BornRef},
        {label: "Halálozás", type: "number", holder: "Pl.: 2020", ref: DiedRef}
      ]}/>
      <TableElement
        ColumnNames={["Név", "Születés", "Halálozás"]}
        Records={[
          {name: "Jóska", born: 1999, died: 2020},
          {name: "Valaki hosszú nevű", born: 1930, died: 1999}
        ]}
      />
    </>
  )
}

export default App

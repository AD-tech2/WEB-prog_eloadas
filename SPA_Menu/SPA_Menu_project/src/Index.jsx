import { useNavigate } from "react-router-dom";
import "./Index.css"

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
        <h2>React SPA</h2> <br/>
        <hr />
        <button onClick={() => navigate("/MemmoryGame")}>Memória játék</button>
        <button onClick={() => navigate("/PaintingApp")}>Rajzolós játék</button>
        <footer>Pálmai Ádám (YB5SIV) és Debreczeni Ákos (HWF5W0)</footer>
    </>
  );
}
import { useNavigate } from "react-router-dom";
import "./Index.css"

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
        <h2 className="IndexTitle">React SPA</h2> <br/>
        <hr />
        <div className="IndexPos">
          <button onClick={() => navigate("/MemmoryGame")}>Memória játék</button>
          <button onClick={() => navigate("/PaintingApp")}>Rajzolós játék</button>
        </div>
        <footer>Pálmai Ádám (YB5SIV) és Debreczeni Ákos (HWF5W0)</footer>
    </>
  );
}
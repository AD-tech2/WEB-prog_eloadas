import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
        <h1>Az elérhető szolgáltatások:</h1> <br/>
        <button onClick={() => navigate("/CurrencyExchanger")}>Pénzváltó</button>
        <button onClick={() => navigate("/RockPaperScissor")}>Kő-papír-olló</button>
    </>
  );
}
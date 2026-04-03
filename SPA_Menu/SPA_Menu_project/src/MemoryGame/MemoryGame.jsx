// App.js
// Renders the GameBoardComponent
import "./MemoryGameApp.css";
import GameBoard from "./Components/GameBoard.jsx";
function MemoryGameApp() {
    return (
        <div className="MemoryGameApp">
            <GameBoard/>
        </div>
    );
}

export default MemoryGameApp;
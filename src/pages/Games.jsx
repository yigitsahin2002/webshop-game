import GameList from "../components/game/GameList";
import Scroll from "../components/Scroll";

export default function Games({editMode}) {

    return (
        <>
        <Scroll showBelow={250} />
        <GameList editMode={editMode}/>
      </>
    )
}
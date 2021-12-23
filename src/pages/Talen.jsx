import TaalList from "../components/taal/TaalList";
import Scroll from "../components/Scroll";

export default function Categorieen({editMode}) {

    return (
        <>
            <Scroll showBelow={250} />
            <TaalList editMode={editMode}/>
        </>
    )
}
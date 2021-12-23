import PlatformList from "../components/platform/PlatformList";
import Scroll from "../components/Scroll";

export default function Categorieen({editMode}) {

    return (
        <>
            <Scroll showBelow={250} />
            <PlatformList editMode={editMode}/>
        </>
    )
}
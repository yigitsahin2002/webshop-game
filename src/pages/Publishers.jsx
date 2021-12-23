import PublisherList from "../components/publisher/PublisherList";
import Scroll from "../components/Scroll";

export default function Categorieen({editMode}) {

    return (
        <>
            <Scroll showBelow={250} />
            <PublisherList editMode={editMode}/>
        </>
    )
}
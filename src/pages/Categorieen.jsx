import CategorieList from "../components/categorie/CategorieList";
import Scroll from "../components/Scroll";

export default function Categorieen({editMode}) {

    return (
        <>
            <Scroll showBelow={250} />
            <CategorieList editMode={editMode}/>
        </>
    )
}
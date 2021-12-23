import BestellingList from "../components/bestelling/BestellingList";
import Scroll from "../components/Scroll";

export default function Bestellingen() {
    return (
        <>
        <Scroll showBelow={250} />
        <BestellingList />
        </>
    )
}
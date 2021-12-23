export default function Home() {
    return (
        <>
            <div style={{margin : "auto", maxWidth : "1000px", width : "90%", backgroundColor : "rgba(0,0,0,0.25)"}}>
                <h2 style={{textAlign : "center", color : "snow"}}>Please navigate slowly through all parts of the application.</h2>
                <h3 style={{textAlign : "center", color : "snow"}}>Please refresh the page if the following occur:</h3>
                <h3 style={{textAlign : "center", color : "snow", borderTop : "1px solid snow", paddingTop : "5px"}}>If colors or placement of items seems off/wrong </h3>
                <h3 style={{textAlign : "center", color : "snow", borderBottom : "1px solid snow", paddingBottom : "5px"}}>If items aren't appearing or says they are empty</h3>
                <h3 style={{textAlign : "center", color : "snow",}}>Scroll up to see navigation</h3>
            </div>
           <div className="home-img">
               <img src="webshop-game/backgroundHome.jpg" alt="home" />
            </div>
        </>
    )
}
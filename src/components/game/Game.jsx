import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useGames } from "../../contexts/GamesProvider";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Info from "@mui/icons-material/Info";
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useShoppingCart } from "../../contexts/CartProvider";

const useStyles = makeStyles(({
  box : {
    margin : "10px",
    maxWidth:"100%", 
    width: "100%",
    borderTop : "1px solid #c9c9c9",
    height : "225px",
    '@media (min-width: 800px)': {
      minHeight : "425px",
      height : "100%",
      maxWidth:"245px",
      margin: "10px", 
      border : "none",
      padding: "0",
      "&:hover":{
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
      }, 
    },
  },
  card : {
    boxShadow : "none", 
    padding: "0", 
    margin: "0", 
    width: "100%", 
    height : "500px",
    '@media (min-width: 800px)': {
      minHeight:"360px",
      height : "100%",
    },
  },
  "div-div-img" : {
    float : "left",
    display : "grid", 
    placeItems : "center", 
    margin : "0",
    marginRight: "10px", 
    padding : "0",
    "& > div" : {
      marginTop: "20px", 
      height: "200px", 
      width: "150px",
      marginLeft : "10px",
      "& > img" : {
        height : "100%", 
        boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"
      }
    },
    '@media (min-width: 800px)': {
      float : "none",
      marginRight: "0",
      "& > div" : {
        marginLeft : "0px",
      },
    },
  },
  content : {
    height : "230px",
    display : "flex",
    flexDirection : "column",
    justifyContent : "space-around",
    padding:"0", 
    margin : "0",
    "& .MuiCardActions-root " : {
      marginBottom : "0",
      display : "flex",
      flexDirection : "column",
      "& > div" : {
          marginTop : "15px",
      }
    },
    '@media (min-width: 800px)': {
      height : "250px",
      display : "flex",
      justifyContent : "space-between",
      "& .MuiCardActions-root" : {
        marginBottom : "0",
        display : "flex",
        flexDirection: "row",
        "& > div:last-child" : {
            marginTop : "0",
        }
      },
    },
  },
  button : {
    width : "100%",
    borderRadius : "3px",
    backgroundColor: "white",
    "&:hover" : {
      backgroundColor: "#16abcc",
      "& svg" : {
        color : "white"
      },
    },
    "& svg" : {
        color : "#16abcc",
        margin : "auto"
    },
    height : "40px",
    '@media (min-width: 800px)': {
      height:"25px",
    },
  },
  "info-icon" : {
    color: "#16abcc", 
    padding : "0", 
    margin : "0 auto",
    marginTop : "45px"
  }
}));

export default function Game({game, editMode}) {
    const classes = useStyles();
    const [ready, setReady] = useState(false);
    
    const { deleteFromCart } = useShoppingCart();
    const {setGameToUpdate, deleteGame} = useGames();

    const handleRemove = useCallback( () => {
      deleteGame(game.id)
      deleteFromCart(game.id)
    }, [deleteGame, deleteFromCart , game.id])

    const handleEditClick = useCallback(() => {
      setGameToUpdate(game.id);
    }, [game.id, setGameToUpdate])

    const handleImgError = useCallback(() => {
      const image = document.getElementById(`${game.id}`);
      image.error = null;
      image.src = "/placeholder.png";
    }, [game.id])

    const handleLoad = useCallback(() => {
      setReady(true)
    }, [setReady])

    return (
      <>  
      {editMode?
        <Box style={{visibility : `${ready? "visible": "hidden"}`}} className={classes.box}>
            <Card className={classes.card}>
              <div className={classes["div-div-img"]}>
                <div>
                <img id={game.id} src={game.imageUri? game.imageUri : "/placeholder.png"} alt="img" onError={handleImgError} onLoad={handleLoad}/>
                </div>
              </div>
              <div className={classes.content}>
              <CardContent>
                  <Typography sx={{fontSize : "bold"}}  component="div">
                  &euro; {(game.prijs).toFixed(2)}
                  </Typography>
                <Typography sx={{fontSize : "bold"}}  component="div">
                  {game.naam}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.publisher.naam}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {game.platform.naam}
                </Typography>
              </CardContent>
              <CardActions>
                <Link style={{width : "100%"}} to={`/overview/games/edit/${game.id}`}>
                  <ListItemButton onClick={handleEditClick} className={classes.button} style={{border : "1px solid #e1e4e6", width : "100%"}}>
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                  </ListItemButton>
                </Link>
                  <ListItemButton onClick={handleRemove} className={classes.button} style={{border : "1px solid #e1e4e6", width : "100%"}}>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                  </ListItemButton>
              </CardActions>
              </div>
            </ Card>
            </Box>
            :
          <Box style={{visibility : `${ready? "visible": "hidden"}`}} className={classes.box}>
            <Link style={{textDecoration : "none"}} to={`/browse/games/${game.id}`}>
              <Card className={classes.card}>
                <div className={classes["div-div-img"]}>
                  <div>
                    <img id={game.id} src={game.imageUri? game.imageUri : "/placeholder.png"} alt="img" onError={handleImgError} onLoad={handleLoad}/>
                  </div>
                </div>
                <div className={classes.content}>
                  <CardContent>
                    <Typography sx={{fontSize : "bold"}}  component="div">
                      &euro; {(game.prijs).toFixed(2)}
                    </Typography>
                    <Typography sx={{fontSize : "bold"}}  component="div">
                      {game.naam}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {game.publisher.naam}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {game.platform.naam}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Info className={classes["info-icon"]}/>
                  </CardActions>
                </div>
              </ Card>
            </Link>
          </Box>    
    }
  </>
  );
}
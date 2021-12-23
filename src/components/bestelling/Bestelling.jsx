import { Link } from "react-router-dom";

import { ListItemIcon, Typography } from "@material-ui/core";
import { Box, ListItemButton } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { makeStyles } from "@material-ui/core";
import { useGames } from "../../contexts/GamesProvider";
import { useBestellingen } from "../../contexts/BestellingenProvider";
import { useMemo, useCallback } from "react";

const useStyles = makeStyles(({
    button : {
      display : "flex",
      justifyContent : "center",
      paddingLeft : "15px",
      textDecoration : "none",
      color : "#16abcc",
      width : "100%",
      maxHeight : "50px",
      height : "50px",
      border : "1px solid #e1e4e6",
      borderRadius : "3px",
      "&:hover" : {
        backgroundColor: "#16abcc",
        color : "white",
        "& svg" : {
          color : "white"
        },
      },
        "& svg" : {
          color : "#16abcc",
          margin : "auto",
        }
    },
    buttons : {
      marginTop : "5px",
      height : "125px",
      justifyContent : "space-around",
      display : "flex",
      flexDirection : "column",
      alignItems : "center",
      '@media (min-width: 800px)': {
        display : "flex",
        flexDirection : "row",
        height : "auto"
      },
    },
    item : {
      display : "flex",
      flexShrink : "1",
      justifyContent : "space-between",
      margin : "0",
      marginTop : "15px",
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
    },
    itemInfo : {
      display : "flex",
      flexDirection : "column",
      justifyContent : "space-between",
      width : "60%",
      maxHeight : "250px",
      padding : "5px",
      marginTop : "20px",
      marginBottom : "20px",
      marginRight : "5px",
    },
    itemInfoTop : {
      paddingTop : "5px",
      height : "max-content",
      width : "100%",
    },
    imgContainer : {
      display : "flex",
      justifyContent : "center",
      alignItems : "center",
      maxWidth : "40%",
      width : "25%",
      height : "100%",
      marginTop : "auto",
      marginBottom : "auto",
      marginLeft : "20px"
    },
    inputSection : {
      width : "100%",
    },
    error : {
      color : "red",
      textAlign : "center"
    }
  }));

export default function Bestelling({id, datum, aantal, user, game : bestellingGame}) {
    const classes = useStyles();
    const { games } = useGames();
    const { deleteBestelling, setBestellingToUpdate } = useBestellingen();

    const game = useMemo(() => {
        return games.find(g => g.id === bestellingGame.id);
    }, [bestellingGame.id, games])

    const handleImgError = useCallback(() => {
      const image = document.getElementById(`${game.id}`);
      image.error = null;
      image.src = "/placeholder.png";
    }, [game.id])

    const handleDelete = useCallback(async () => {
      await deleteBestelling(id);
    }, [deleteBestelling, id])

    const handleUpdate = useCallback(() => {
      setBestellingToUpdate(id);
    }, [setBestellingToUpdate, id])

    return (
        <>
        {game &&
            <Box className={classes.item}>
                <Box className={classes.imgContainer}>
                  <img id={game?.id} style={{maxHeight : "300px", maxWidth : "225px", width : "100%"}} src={game?.imageUri? game?.imageUri : "placeholder.png"} alt={game?.id} onError={handleImgError} />
                </Box>
                <Box className={classes.itemInfo}>
                  <Box className={classes.itemInfoTop}>
                    <Typography className={classes.color} sx={{marginBottom : "10px", wordBreak : "break-word"}} variant="h6">{game?.naam}</Typography>
                    <Box sx={{width : "90%", display : "flex", justifyContent : "space-between", margin : "auto"}}>
                      <Typography className={classes.color} variant="body2">Total ordered: </Typography>
                      <Typography className={classes.color} variant="body2">{aantal}</Typography>
                    </Box>
                    <Box sx={{width : "90%", display : "flex", justifyContent : "space-between", margin : "auto"}}>
                      <Typography className={classes.color} variant="body2">Datum: </Typography>
                      <Typography className={classes.color} variant="body2">{new Date(datum).toLocaleDateString()}</Typography>
                    </Box>
                    <Box sx={{width : "90%", display : "flex", justifyContent : "space-between", margin : "auto"}}>
                      <Typography className={classes.color} variant="body2">Prijs per unit: </Typography>
                      <Typography className={classes.color} variant="body2">&euro; {game?.prijs.toFixed(2)}</Typography>                    </Box>
                    </Box>
                  <Box className={classes.buttons}>
                    <Link to={`/bestellingen/edit/${id}`} style={{width : "100%", textDecoration : "none"}}>
                      <ListItemButton onClick={handleUpdate} className={`${classes.button}`}>
                        <ListItemIcon>
                          <EditIcon />
                        </ListItemIcon>
                      </ListItemButton>
                    </Link>
                    
                    <ListItemButton onClick={handleDelete} className={`${classes.button}`}>
                      <ListItemIcon>
                        <DeleteIcon />
                      </ListItemIcon>
                    </ListItemButton>
                  </Box>
                </Box>
            </Box>
    }
        </>
    )
}
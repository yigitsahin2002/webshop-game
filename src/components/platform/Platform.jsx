import { useCallback } from "react";
import { usePlatforms } from "../../contexts/PlatformProvider";
import { Link } from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useGames } from "../../contexts/GamesProvider";
import { useShoppingCart } from "../../contexts/CartProvider";

const useStyles = makeStyles(({
  container : {
    textDecoration : "none",
    border : "1px solid rgb(220, 220, 220)",
    borderRadius : "0 0 5px 5px",
    color: "black",
    maxWidth : "380px",
    width : "400px",
    minHeight : "50px",
    display : "grid",
    placeItems : "center",
    '&:hover' : {
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
    },
    '@media (min-width: 800px)': {
      maxWidth : "300px",
      width : "315px",
    },
  },
  buttons : {
    width : "100%",
    borderRadius : "0 0 5px 5px",
    display : "flex",
    flexDirection : "column",
    border : "1px solid #f2072b",
    '& > a:first-of-type' : {
      borderBottom : "1px solid rgba(255, 123, 0, 0.25)",
    },
    '@media (min-width: 800px)': {
      flexDirection : "row",
      '& > a:first-of-type' : {
        borderBottom : "none",
        borderRight : "1px solid rgba(255, 123, 0, 0.25)",

      },
    },
  },
  button : {
    cursor : "pointer",
    height : "35px",
    display : "grid",
    placeItems : "center",
    color : "#f2072b",
    '&:hover' : {
      backgroundColor : "#f2072b",
      color : "white"
    },
    '@media (min-width: 800px)': {
      width : "50%"
    },
  }
}));

export default function Platform({platform, editMode}) {
    const classes = useStyles();

    const {setPlatformToUpdate, deletePlatform} = usePlatforms();
    const { games } = useGames();
    const { deleteFromCart, shoppingCart } = useShoppingCart();

    const handleRemove = useCallback(async () => {
      let gamesWithPlatform = [];
      let gamesInCartToDelete = [];

      for (const g of games) {
        if (g.platform.id === platform.id) {
          gamesWithPlatform.push(g.id);
        }
      }

      for (const item of shoppingCart) {
        if (gamesWithPlatform.includes(item.id)) {
          gamesInCartToDelete.push(item.id)
        }
      }

      deleteFromCart(gamesInCartToDelete)

      await deletePlatform(platform.id)

    }, [deletePlatform, platform.id, deleteFromCart, games, shoppingCart])

    const handleEditClick = useCallback(() => {
      setPlatformToUpdate(platform.id);
    }, [platform.id, setPlatformToUpdate])

    return (
      <>
      {editMode?
            <Box className={classes.container}>
              <p>{platform.naam}</p>
              <Box className={classes.buttons}>
                    <Link className={classes.button} to={`/overview/platforms/edit/${platform.id}`} onClick={handleEditClick}>
                      <EditIcon size=""/>
                    </Link>
                    <Box className={classes.button} onClick={handleRemove}>
                      <DeleteIcon size="" className="icon" />
                    </Box>
              </Box>
            </Box>

      :
          <Box className={classes.container}>
            <p>{platform.naam}</p>
          </Box>
      }
      </>
    )}
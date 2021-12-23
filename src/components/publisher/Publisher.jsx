import { useCallback } from "react";
import { usePublishers } from "../../contexts/PublisherProvider";
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
    border : "1px solid #0400ff",
    '& > a:first-of-type' : {
      borderBottom : "1px solid rgba(4, 0, 255, .25)",
    },
    '@media (min-width: 800px)': {
      flexDirection : "row",
      '& > a:first-of-type' : {
        borderBottom : "none",
        borderRight : "1px solid rgba(4, 0, 255, .25)",

      },
    },
  },
  button : {
    cursor : "pointer",
    height : "35px",
    display : "grid",
    placeItems : "center",
    color : "#0400ff",
    '&:hover' : {
      backgroundColor : "#0400ff",
      color : "white"
    },
    '@media (min-width: 800px)': {
      width : "50%"
    },
  }
}));

export default function Publisher({publisher, editMode}) {
    const classes = useStyles();

    const {setPublisherToUpdate, deletePublisher} = usePublishers();
    const { games } = useGames();
    const { deleteFromCart, shoppingCart } = useShoppingCart();

    const handleRemove = useCallback(async () => {
      let gamesWithPublisher = [];
      let gamesInCartToDelete = [];

      for (const g of games) {
        if (g.publisher.id === publisher.id) {
          gamesWithPublisher.push(g.id);
        }
      }

      for (const item of shoppingCart) {
        if (gamesWithPublisher.includes(item.id)) {
          gamesInCartToDelete.push(item.id)
        }
      }

      deleteFromCart(gamesInCartToDelete)
      
      await deletePublisher(publisher.id)

    }, [deletePublisher, publisher.id, deleteFromCart, games, shoppingCart])

    const handleEditClick = useCallback(() => {
      setPublisherToUpdate(publisher.id);
    }, [publisher.id, setPublisherToUpdate])

    return (
      <>
      {editMode?
            <Box data-cy="publisher_box" className={classes.container}>
              <p>{publisher.naam}</p>
              <Box className={classes.buttons}>
                    <Link data-cy="publisher_edit_btn" className={classes.button} to={`/overview/publishers/edit/${publisher.id}`} onClick={handleEditClick}>
                      <EditIcon size=""/>
                    </Link>
                    <Box data-cy="delete_publisher_btn" className={classes.button} onClick={handleRemove}>
                      <DeleteIcon size="" className="icon" />
                    </Box>
              </Box>
            </Box>

      :
          <Box className={classes.container}>
            <p>{publisher.naam}</p>
          </Box>
      }
      </>
    )}
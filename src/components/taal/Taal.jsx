import { useCallback } from "react";
import { useTalen } from "../../contexts/TaalProvider";
import { Link } from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
    border : "1px solid #08b1ff",
    '& > a:first-of-type' : {
      borderBottom : "1px solid rgba(8, 177, 255, 0.25)",
    },
    '@media (min-width: 800px)': {
      flexDirection : "row",
      '& > a:first-of-type' : {
        borderBottom : "none",
        borderRight : "1px solid rgba(8, 177, 255, 0.25)",

      },
    },
  },
  button : {
    cursor : "pointer",
    height : "35px",
    display : "grid",
    placeItems : "center",
    color : "#08b1ff",
    '&:hover' : {
      backgroundColor : "#08b1ff",
      color : "white"
    },
    '@media (min-width: 800px)': {
      width : "50%"
    },
  }
}));

export default function Taal({taal, editMode}) {
    const classes = useStyles();

    const {setTaalToUpdate, deleteTaal} = useTalen();

    const handleRemove = useCallback( () => {
        deleteTaal(taal.id)
    }, [deleteTaal, taal.id])

    const handleEditClick = useCallback(() => {
      setTaalToUpdate(taal.id);
    }, [taal.id, setTaalToUpdate])

    return (
      <>
      {editMode?
            <Box className={classes.container}>
              <p>{taal.naam}</p>
              <Box className={classes.buttons}>
                    <Link className={classes.button} to={`/overview/talen/edit/${taal.id}`} onClick={handleEditClick}>
                      <EditIcon size=""/>
                    </Link>
                    <Box className={classes.button} onClick={handleRemove}>
                      <DeleteIcon size="" className="icon" />
                    </Box>
              </Box>
            </Box>

      :
          <Box className={classes.container}>
            <p>{taal.naam}</p>
          </Box>
      }
      </>
    )}
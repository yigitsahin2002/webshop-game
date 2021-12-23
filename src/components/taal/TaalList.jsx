import Taal from "./Taal"
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useTalen } from "../../contexts/TaalProvider";

import { makeStyles } from "@mui/styles"

import LinearProgress from '@mui/material/LinearProgress';
import { Box, Grid, ListItemIcon, ListItemText } from "@material-ui/core";

import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorMessage from "../error/ErrorMessage";
import { useLogout } from "../../contexts/AuthProvider";
import { useCallback } from "react";

const useStyles = makeStyles(({
  button : {
    cursor : "pointer",
    display : "flex",
    paddingLeft : "15px",
    alignItems : "center",
    textDecoration : "none",
    color : "#08b1ff",
    backgroundColor : "white",
    maxWidth : "200px",
    width : "100%",
    height : "50px",
    marginTop : "15px",
    border : "1px solid #e1e4e6",
    borderRadius : "3px",
    "&:hover" : {
      backgroundColor: "#08b1ff",
      color : "white",
      "& svg" : {
        color : "white"
      },
    },
      "& svg" : {
        color : "#08b1ff",
        margin : "auto"
      }, 
  },
  box : {
    margin : "10px",
      maxWidth:"100%",
      width : "100%",
      height : "275px",
      '@media (min-width: 800px)': {
        maxWidth:"245px",
        height : "350px",
        margin: "10px", 
      },
  },
  loading : {
    maxWidth : "1000px",
    width : "85%",
    position: "relative",
    left : "50%",
    transform : "translateX(-50%)",
    height: "20px"
  },
  "button-container" : {
    maxWidth : "1000px",
    width : "80%",
    margin : "0 auto",
    paddingLeft : "0",
  },
}));

export default function TaalList({editMode}) {
    const classes = useStyles();
    const { talen, loading, error, setError } = useTalen();
    const logout = useLogout();

    const handleError = useCallback(() => {
      setError('');
    }, [setError])
  
    const handleLogout = useCallback(async () => {
      await logout();
      setError('');
    }, [logout, setError])

    if (loading) return (
      <div className={classes.loading} data-cy="loading">
          <LinearProgress />
      </div>
    )
    if (error)
    return (
        <Box className="nieuwError">
          <ErrorMessage error={error}/>
          {typeof error === 'object' && error.response?.data && error.response.data.code ==='VALIDATION_FAILED'?
            <CloseIcon style={{cursor : "pointer"}} onClick={handleError}/>
            :
            <LogoutIcon style={{cursor : "pointer"}} onClick={handleLogout}/>
          }
        </Box>
    );
  
    if (!talen || !talen.length) {
      return (
        <>
        {editMode && (
          <Box className={classes["button-container"]}>
            <Link className={classes["button"]} to="/overview/talen/add" style={{textDecoration : "none"}}>
              <ListItemText color="#16abcc" primary="Add taal"/>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
            </Link>
          </Box>
        )}
          <p className="noneLeft">No more talen left...</p>
          </>
      );
    }

    return (
      <>
      {editMode && (
        <Box className={classes["button-container"]}>
          <Link className={classes["button"]} to="/overview/talen/add" style={{textDecoration : "none"}}>
            <ListItemText color="#16abcc" primary="Add taal"/>
            <ListItemIcon>
                <AddIcon />
            </ListItemIcon>
          </Link>
        </Box>
      )}
        <Grid
          width="100%"
          container
          justifyContent="center"
          style={{gap : "25px", margin: "25px auto",  maxWidth : "1000px", padding : "0"}}
          >
          {talen && talen.map(taal => {
            return (
                <Taal key={taal.id} taal={taal} editMode={editMode}/>
            )
          })
          }
        </Grid>
    </>
    )
} 
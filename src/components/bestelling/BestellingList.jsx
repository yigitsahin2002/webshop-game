import { Box, CircularProgress } from "@material-ui/core";
import { Stack, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useLogout, useSession } from "../../contexts/AuthProvider"
import { useBestellingen } from "../../contexts/BestellingenProvider";
import Bestelling from "./Bestelling";
import { makeStyles } from "@material-ui/core"

import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorMessage from "../error/ErrorMessage";
import { useGames } from "../../contexts/GamesProvider";


const useStyles = makeStyles(({
    outerContainer : {
      margin : "auto",
      maxWidth : "1000px",
      width : "99%",
    },
    button : {
      paddingLeft : "15px",
      textDecoration : "none",
      color : "#16abcc",
      width : "150px",
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
          margin : "auto"
        }
      
    },
    footerButton : {
      paddingLeft : "15px",
      textDecoration : "none",
      color : "#16abcc",
      width : "50%",
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
          margin : "auto"
        }
      
    },
    spinner : {
      position : "absolute",
      top : "50%",
      left : "50%",
      transform : "translate(-50%, 50%)"
    },
    shoppingFooter : {
      width : "100%",
      height : "auto",
      marginTop : "20px",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      borderRadius : "10px 10px 0 0",
      paddingBottom : "10px"
    },
    shoppingFooterButtons : {
      display : "flex",
      flexDirection : "row",
      justifyContent : "space-between",
      padding : "5px"
    },
    totaal : {
      maxWidth : "1000px",
      display : "flex",
      justifyContent : "space-between",
      padding: "15px",
      margin : "0",
      borderRadius : "10px 10px 0 0",
      backgroundColor : "rgba(22, 171, 204, 0.8)"
    },
}));

export default function BestellingList() {
    const classes = useStyles();
    const { user } = useSession();
    const { error : errorG, setError : setErrorG } = useGames();
    const { bestellingen, loading, error : errorB, setError : setErrorB } = useBestellingen();
    const logout = useLogout();

    const userBestellingen = useMemo(() => {
        return user && bestellingen.filter(b => b.user.id === user.id);
    }, [bestellingen, user])

    const handleError = useCallback(() => {
      setErrorB('');
      setErrorG('');
    }, [setErrorB, setErrorG])
  
    const handleLogout = useCallback(async () => {
      await logout();
      setErrorB('');
      setErrorG('');
    }, [logout, setErrorB, setErrorG])


        if (loading) return (
            <div className={classes.spinner} data-cy="loading">
            <CircularProgress />
            </div>
        )

        if (errorB || errorG)
        return (
          <>
          {errorB && 
            <Box className="nieuwError">
              <ErrorMessage error={errorB}/>
              {typeof errorB === 'object' && errorB.response?.data && errorB.response.data.code ==='VALIDATION_FAILED'?
                <CloseIcon style={{cursor : "pointer"}} onClick={handleError}/>
                :
                <LogoutIcon style={{cursor : "pointer"}} onClick={handleLogout}/>
              }
            </Box>
          }
          {errorG &&
            <Box className="nieuwError">
              <ErrorMessage error={errorG}/>
              {typeof errorG === 'object' && errorG.response?.data && errorG.response.data.code ==='VALIDATION_FAILED'?
                <CloseIcon style={{cursor : "pointer"}} onClick={handleError}/>
                :
                <LogoutIcon style={{cursor : "pointer"}} onClick={handleLogout}/>
              }
            </Box>
          }
          </>
        );
    
        if (!userBestellingen || !userBestellingen.length > 0) {
            return (
                <p className="noneLeft">Geen bestellingen...</p>
            );
        }

        return (
            <>
            <Box component="div" className={classes.outerContainer}>
                <Box sx={{maxWidth : "1000px", width : "99%", textAlign : "center"}}>
                <Typography sx={{marginBottom : "50px"}} variant="h4" >
                {user ? `${user.naam}'s bestellingen` : "loading user..."}
                </Typography>
            </Box>
            <Stack>
                {userBestellingen.map(ub => {
                    return (
                    <Bestelling key={ub.id} {...ub}/>
                    )
                })}
            </Stack>
            </Box>
            </>
        )
}
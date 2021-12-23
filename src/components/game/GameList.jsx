import Game from "./Game";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useGames } from "../../contexts/GamesProvider";
import ListPagination from "../../components/pagination/ListPagination"
import { useCallback, useEffect, useMemo, useState } from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from "@mui/styles"

import LinearProgress from '@mui/material/LinearProgress';

import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorMessage from "../error/ErrorMessage";
import { useLogout } from "../../contexts/AuthProvider";

const useStyles = makeStyles(({
  button : {
    flexDirection : "row",
    textDecoration : "none",
    color : "#16abcc",
    width : "150px",
    height : "50px",
    borderRadius : "3px",
    "&:hover" : {
      backgroundColor: "#16abcc",
      color : "white",
      "& div:first-child" : {
        color : "white"
      },
      "& svg" : {
        color : "white"
      },
    },
      "& svg" : {
        color : "#16abcc",
        margin : "auto"
      }
    
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
  }
}));

export default function GameList({editMode}) {
  const classes = useStyles();
  const {games, loading, error, setError} = useGames();
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage] = useState(10);
  const [pagesVisited, setPagesVisited] = useState(pageNumber * itemsPerPage);
  const logout = useLogout();

  const paginatedGames = useMemo(() => {
    return games.sort((a, b) => {
      return a.naam > b.naam;
    }).slice(pagesVisited, pagesVisited + itemsPerPage);
  }, [games, itemsPerPage, pagesVisited])

  useEffect(() => {
    setPagesVisited((pageNumber - 1) * itemsPerPage)
  }, [pageNumber, itemsPerPage, paginatedGames])

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
  
    if (!games || !games.length) {
      return (
        <>
        {editMode && (
          <div className="addWrap">
            <Link to="/overview/games/add" style={{ color : "#16abcc", textDecoration: "none" }}>
            <ListItemButton className={`${classes.button}`} style={{border : "1px solid #e1e4e6"}}>
                <ListItemText sx={{backgroundColor: "red", color : "#16abcc"}} primary="Add game"/>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
              </ListItemButton>
            </Link>
          </div>
        )}
          <p className="noneLeft">No more games left</p>
          </>
      );
    }
    return (
      <>
        {editMode && (
          <div className="addWrap">
            <Link to="/overview/games/add" style={{textDecoration: "none", width : "100%"}}>
              <ListItemButton className={classes.button} style={{border : "1px solid #e1e4e6"}}>
                  <ListItemText sx={{marginLeft : "5px" ,color : "#16abcc"}} primary="Add game"/>
                    <ListItemIcon>
                      <AddIcon />
                  </ListItemIcon>
              </ListItemButton>
              </Link>
          </div>
        )}
        <Box sx={{margin : " 25px auto", maxWidth : "1200px"}}>
          <Grid
          width="100%"
          container
          justifyContent="center"
          sx={{margin: "auto", padding : "0"}}
          >
            {games &&
              paginatedGames.map((game) => {
                return (
                    <Game key={game.id} game={game} editMode={editMode} />
                )
              })}
          </Grid>
        </Box>
        <ListPagination currentPage={pageNumber} setPageNumber={setPageNumber} totalPages={Math.ceil(games.length / itemsPerPage)}/>
      </>
    );
}

import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider'
import CategoryIcon from '@mui/icons-material/Category';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import PersonIcon from '@mui/icons-material/Person';
import GamesIcon from '@mui/icons-material/Games';
import LanguageIcon from '@mui/icons-material/Language';

import { makeStyles } from "@material-ui/core"
import { useSession } from "../contexts/AuthProvider";
import { useMemo } from "react";

const useStyles = makeStyles(({
  container : {
    margin : "0",
    padding : "0",
    position : "relative",
    top :"50%",
    left : "50%",
    transform : "translate(-50%, 70%)",
    maxWidth: "360px", 
    borderRadius : "1px",
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
  },
  button : {
    padding: "5px 5px 5px 10px", 
    height : "50px", 
    width : "100%",
    "&:hover" : {
      "& div:first-of-type" : {
        "& > svg" : {
          rotate : "360deg",
          transition : ".25s"
        }
      }
    }
  },
  icon : {
    marginLeft : "20px",
  },
  "icon-game" : {
    color : "#16abcc",
  },
  "icon-categorie" : {
    color : "#ff7b00"
  },
  "icon-publisher" : {
    color : "#0400ff"
  },
  "icon-platforms" : {
    color : "#f2072b"
  },
  "icon-talen" : {
    color : "#08b1ff"
  }
}));

const role = "admin";

export default function Browse() {
    const classes = useStyles();

    const { isAuthed, hasRole } = useSession();

    const canShowRoute = useMemo(() => {
        if (!role) return isAuthed;
        return isAuthed && hasRole(role);
    }, [isAuthed, hasRole])
    
    return (
    <Box className={classes.container}>
        <nav aria-label="main mailbox folders">
          <List>
            <ListItem disablePadding>
              <Link to="/browse/games" style={{color :"black", textDecoration: "none", width : "100%"}}>
                  <ListItemButton className={`${classes.button}`}>
                    <ListItemIcon /* sx={{color : "#16abcc"}}  */className={`${classes.icon} ${classes["icon-game"]}`}>
                      <VideogameAssetIcon />
                    </ListItemIcon>
                    <ListItemText primary="Games" />
                  </ListItemButton>
              </Link>
            </ListItem>
            {
              canShowRoute &&
              <>
                <Divider sx={{ width : '100%'}}/>
                <ListItem disablePadding >
                <Link to="/browse/categorieen" style={{color :"black", textDecoration: "none", width : "100%"}}>
                      <ListItemButton className={`${classes.button}`}>
                        <ListItemIcon /* sx={{color : "#ff7b00"}} */ className={`${classes.icon} ${classes["icon-categorie"]}`}>
                          <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Categorieen" />
                      </ListItemButton>
                  </Link>
                </ListItem>
                <Divider sx={{ width : '100%'}}/>
                <ListItem disablePadding >
                    <Link to="/browse/publishers" style={{color :"black", textDecoration: "none", width : "100%"}}>
                      <ListItemButton className={`${classes.button}`}>
                        <ListItemIcon /* sx={{color : "#0400ff"}} */ className={`${classes.icon} ${classes["icon-publisher"]}`}>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Publishers" />
                      </ListItemButton>
                  </Link>
                </ListItem>
                <Divider sx={{ width : '100%'}}/>
                <ListItem disablePadding>
                <Link to="/browse/platforms" style={{color :"black", textDecoration: "none", width : "100%"}}>
                      <ListItemButton className={`${classes.button}`}>
                        <ListItemIcon /* sx={{color : "#f2072b"}} */ className={`${classes.icon} ${classes["icon-platforms"]}`}>
                          <GamesIcon />
                        </ListItemIcon>
                        <ListItemText primary="Platforms" />
                      </ListItemButton>
                  </Link>
                </ListItem>
                <Divider sx={{ width : '100%'}}/>
                <ListItem disablePadding>
                <Link to="/browse/talen" style={{color :"black", textDecoration: "none", width : "100%"}}>
                      <ListItemButton className={`${classes.button}`}>
                        <ListItemIcon /* sx={{color : "#08b1ff"}} */ className={`${classes.icon} ${classes["icon-talen"]}`}>
                          <LanguageIcon />
                        </ListItemIcon>
                        <ListItemText primary="Talen" />
                      </ListItemButton>
                  </Link>
                </ListItem>
              </>
            }
          </List>
        </nav>
    </Box>
    )
}
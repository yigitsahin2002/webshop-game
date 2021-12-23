import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LockIcon from '@mui/icons-material/Lock';

import { Box, makeStyles } from "@material-ui/core"

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PreviewIcon from '@mui/icons-material/Preview';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useHistory } from 'react-router';
import { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLogout, useSession } from '../../contexts/AuthProvider';
import UserAvatar from '../user/UserAvatar';


const useStyles = makeStyles(({
    smallNavDiv : {
      padding: "0",
      opacity: "100%",
      backgroundColor: "#212121",
      position: "sticky",
      width: "100%",
      top: "0",
      zIndex: "2",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      height : "50px",
      '@media (min-width: 900px)': {
        display : "none",
      },
    },
    smallNav : {
      maxWidth: "1000px",
      width: "100%",
      margin: "0 auto",
      height : "100%"
    },
    mainButtons : {
      maxWidth: "100%",
      width: "100%",
      height : "100%",
      margin: "0 auto",
      display: "flex",
      flexDirection: "row",
      justifyContent : "space-between",
      alignItems: "center"
    },
    listItem : {
      backgroundColor : "#212121",
      width :"100%",
      height : "50px",
      margin : "0 auto",
      "&:hover" : {
        backgroundColor : "#505050"
      }
    },
    auth : {
      backgroundColor : "#525252",
      "&:hover" : {
        backgroundColor : "#505050"
      }
    },
    listButton : {
      height : "100%",
      width : "100%"
    },
    homeicon : {
      marginLeft: "20px",
      "&:hover" : {
        cursor : "pointer"
      }, 
      color : "#cccccc",
      padding : "0",
      margin : "0",
    },
    hamburgericon : {
      marginRight: "20px",
      "&:hover" : {
        cursor : "pointer"
      },
      color : "#cccccc",
      padding : "0",
      margin : "0"
    }
  }));

export default function NavHeader() {
    const { hasRole } = useSession();
    const classes = useStyles();
    const history = useHistory();
    const { isAuthed, setError, user } = useSession();
    const logout = useLogout();


    const [open, setOpen] = useState(false);

    const handleGoHome = useCallback(() => {
        history.push("/");
      }, [history])
    
    const handleClick = useCallback(() => {
        setOpen(!open);
      }, [open]);

    const handleLogout = useCallback(() => {
      setError('');
      logout();
    }, [setError, logout]);

    const handleLogoutMobile = useCallback(() => {
      setError('');
      logout();
      handleClick();
    }, [setError, logout, handleClick])

    return (
    <>
    <div className="nav-div">
        <nav className="nav">
          <div onClick={handleGoHome}><HomeRoundedIcon sx={{color : "#cccccc", alignSelf : "center", padding: "0", margin : "0"}} /></div>
          <ul className="nav-ul">
              <li>
                <NavLink className="link" activeClassName='link disabled' key="game" to={`/browse`}>browse</NavLink>
              </li>
              <li>
                <NavLink data-cy="overview_btn" className="link" key="publisher" to={`/overview`}>{isAuthed && !hasRole("admin") && <LockIcon data-cy="lock_icon"/>} overview</NavLink>
              </li>
              <li>
                <NavLink className="link"key="winkelmand" to={`/winkelmandje`}>winkelmandje</NavLink>
              </li>
              <li>
                <NavLink className="link"key="categorieen" to={`/bestellingen`}>bestellingen</NavLink>
              </li>
              {
                isAuthed ? (
                  <>
                    <li>
                      <NavLink className="link"key="user" to={`/user/info`}>
                          < UserAvatar naam={user?.naam} achternaam={user?.achternaam} />
                      </NavLink>
                    </li>
                  
                    <li>
                      <div className="link authButtons" onClick={handleLogout}>Sign out</div>
                    </li>
                  </>
                ) : (
                  <>
                  <li>
                    <NavLink className="link authButtons" key="login" to={`/login`}>Sign in</NavLink>
                  </li>
                  <li>
                    <NavLink className="link authButtons" key="register" to={`/register`}>Register</NavLink>
                  </li>
                  </>
                )
              }
            </ul>
        </nav>
      </div>
      <div className={classes.smallNavDiv}>
              <div className={classes.smallNav}>
                <div className={classes.mainButtons}>
                    <HomeRoundedIcon onClick={handleGoHome} className={classes.homeicon}/>
                  {open? <MenuOpenIcon className={classes.hamburgericon} onClick={handleClick}/> : <MenuIcon className={classes.hamburgericon} onClick={handleClick} />}
                </div>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List className={classes.listItem} component="div" disablePadding>
                    <NavLink style={{textDecoration : "none"}} to="/browse">
                      <ListItemButton className={classes.listButton} onClick={handleClick}>
                        <ListItemIcon>
                          <MenuBookIcon sx={{color : "#cccccc", marginLeft : "10px"}}/>
                        </ListItemIcon>
                      <ListItemText sx={{color : "#cccccc"}} primary="Browse" />
                      </ListItemButton>
                    </NavLink>
                  </List>
                  <List className={classes.listItem} component="div" disablePadding>
                    <NavLink data-cy="overview_btn" style={{textDecoration : "none"}} to="/overview">
                      <ListItemButton className={classes.listButton} onClick={handleClick}>
                        <ListItemIcon>
                        {
                          (isAuthed && !hasRole("admin"))?
                          <LockIcon data-cy="lock_icon" sx={{color : "#cccccc", marginLeft : "10px"}}/>
                          :
                          <PreviewIcon sx={{color : "#cccccc", marginLeft : "10px"}}/>
                        }
                        </ListItemIcon>
                      <ListItemText sx={{color : "#cccccc"}} primary="Overview" />
                      </ListItemButton>
                    </NavLink>
                  </List>
                  <List className={classes.listItem} component="div" disablePadding>
                    <NavLink style={{textDecoration : "none"}} to="/winkelmandje">
                      <ListItemButton className={classes.listButton} onClick={handleClick}>
                        <ListItemIcon>
                          <ShoppingCartOutlinedIcon sx={{color : "#cccccc", marginLeft : "10px"}}/>
                        </ListItemIcon>
                      <ListItemText sx={{color : "#cccccc"}} primary="Winkelmandje" />
                      </ListItemButton>
                    </NavLink>
                  </List>
                  <List className={classes.listItem} component="div" disablePadding>
                    <NavLink style={{textDecoration : "none"}} to="/bestellingen">
                      <ListItemButton className={classes.listButton} onClick={handleClick}>
                        <ListItemIcon>
                          <ReceiptLongOutlinedIcon sx={{color : "#cccccc", marginLeft : "10px"}}/>
                        </ListItemIcon>
                      <ListItemText sx={{color : "#cccccc"}} primary="Bestellingen" />
                      </ListItemButton>
                    </NavLink>
                  </List>
                  <List className={classes.listItem} component="div" disablePadding>
                    <NavLink style={{textDecoration : "none"}} to="/user/info">
                      <ListItemButton className={classes.listButton} onClick={handleClick}>
                        <ListItemIcon>
                          <Box sx={{color : "#cccccc", marginLeft : "8px"}}>
                            < UserAvatar naam={user?.naam} achternaam={user?.achternaam} />
                          </Box>
                        </ListItemIcon>
                      <ListItemText sx={{color : "#cccccc"}} primary="User info" />
                      </ListItemButton>
                    </NavLink>
                  </List>
                  {
                    isAuthed? (
                      <List className={`${classes.listItem} ${classes.auth}`} component="div" disablePadding>
                          <ListItemButton className={classes.listButton} onClick={handleLogoutMobile}>
                            <ListItemIcon>
                              <LogoutIcon sx={{color : "#cccccc", marginLeft : "10px"}}/>
                            </ListItemIcon>
                            <ListItemText sx={{color : "#cccccc"}} primary="Sign out" />
                          </ListItemButton>
                    </List>
                    ) : (
                      <>
                        <List className={`${classes.listItem} ${classes.auth}`} component="div" disablePadding>
                          <NavLink style={{textDecoration : "none"}} to="/login">
                            <ListItemButton className={classes.listButton} onClick={handleLogoutMobile}>
                              <ListItemIcon>
                                <LoginIcon sx={{color : "#cccccc", marginLeft : "10px"}}/>
                              </ListItemIcon>
                            <ListItemText sx={{color : "#cccccc"}} primary="Sign in" />
                            </ListItemButton>
                          </NavLink>
                        </List>
                        <List className={`${classes.listItem} ${classes.auth}`} component="div" disablePadding>
                          <NavLink style={{textDecoration : "none"}} to="/register">
                            <ListItemButton className={classes.listButton} onClick={handleLogoutMobile}>
                              <ListItemIcon>
                                <AppRegistrationIcon sx={{color : "#cccccc", marginLeft : "10px"}}/>
                              </ListItemIcon>
                            <ListItemText sx={{color : "#cccccc"}} primary="Register" />
                            </ListItemButton>
                          </NavLink>
                        </List>
                      </>
                    )
                  }
                </Collapse>
              </div>
      </div>
    </>
    )
}
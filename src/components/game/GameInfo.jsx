import Box from '@mui/material/Box';
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core"
import { Typography } from '@mui/material';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useState } from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Language';

import { useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AantalInput from "../../components/form-inputs/AantalInput";
import { useHistory } from 'react-router';

import { useShoppingCart } from "../../contexts/CartProvider"

const validationRules = {
  aantal: {
    required : "This field is required",
    min : {value : 1, message : "Minimum is 1"},
    max : {value : 1000, message : "Maximum is 1000"},
  }
};

const useStyles = makeStyles(({
  container : {
    margin: "auto", 
    padding: "0",
    maxWidth : "1000px",
    width : "85%",
    minHeight : "800px" 
  },
  "img-and-order" : {
    display : "grid",
    gridTemplateColumns : "2fr 1fr",
    gap : "10px",
    padding : "0",
    marginTop : "20px",
    maxWidth: "100%",
    width : "100%",
    height : "auto",
    '@media (max-width: 900px)': {
      gridTemplateColumns : "100%",
    },
  },
  "img-container" : {
    backgroundColor : "#f5f5f5",
    boxShadow: "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset"
  },
  "img-div" : {
    maxHeight : "100%",
    height : "100%",
    maxWidth : "220px",
    width : '100%',
    margin : "auto",
  },
  img : {
    maxWidth : "100%",
    width : "100%",
    maxHeight : "100%",
    height : "100%",
  },
  "order-div" : {
    display : "flex",
    flexDirection : "column",
    justifyContent : "space-around",
    backgroundColor : "#f5f5f5",
    boxShadow: "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset",
    maxHeight : "100%",
    height : "100%"
  },
  button : {
    cursor : "pointer",
    display : "flex",
    alignItems : "center",
    padding : "0",
    margin : "0",
    marginRight : "5px",
    textDecoration : "none",
    color : "#16abcc",
    backgroundColor : "white",
    maxWidth : "200px",
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
        margin : "auto"
      }
    
  },
  form : {
    maxWidth : "100%",
    width: "100%",
    height: "100px",
    display : "grid",
    gridTemplateColumns: "100%",
    gridTemplateRows : "80px 20px",
    alignItems : "center",
    margin: "0 auto",
  },
  "game-info" : {
    height : "100%", 
    marginTop: "10px", 
    marginLeft: "25px",
    marginRight : "25px",
  },
  color : {
    color : "rgb(60,60,60)"
  },
  addedInfo : {
    margin: "0", 
    marginTop : "15px", 
    maxWidth : "100%",
    width : "100%", 
    backgroundColor : 
    "#f5f5f5", 
    boxShadow: "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset"
  },
  buttons : {
    maxWidth : "100%",
    width : "100%",
    display : "flex",
    justifyContent : "space-around",
    gap : "5px",
    '@media (max-width: 900px)': {
      justifyContent : "space-evenly",
    },
  }
}));

export default function GameInfo({games}) {

    const {addToCart} = useShoppingCart();
    const [openD, setOpenD] = useState(false);
    const [openC, setOpenC] = useState(false);
    const [openT, setOpenT] = useState(false);
    const history = useHistory();

    const classes = useStyles();
    const {id} = useParams();

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm();

    useEffect(() => {
      reset();
  }, [reset]);

    const game = games.find(g => g.id === id);

    const handleImgError = useCallback(() => {
      const image = document.getElementById(`${game?.id}`);
      image.error = null;
      image.src = "/placeholder.png";
    }, [game?.id])

    const onSubmit = useCallback(
      async (data) => {
        
        try {
          game && addToCart({id: game.id, aantal : data.aantal})
          history.push("/browse/games");
        } catch (error) {
          console.error(error);
        }
      },
      [addToCart, game, history]
    );

    const handleClickD = () => {
      setOpenD(!openD);
    };

    const handleClickC = () => {
      setOpenC(!openC);
    };

    const handleClickT = () => {
      setOpenT(!openT);
    };

    return (
    <>  
    {game?
    <Box className={classes.container} component="div">
      <Box className={classes["img-and-order"]} component="div">
        <Box className={classes['img-container']} component="div">
          <Box className={classes["img-div"]} component="div">
            <img id={game.id} className={classes.img} src={game.imageUri? game.imageUri : "/placeholder.png"} alt={game.id} onError={handleImgError} />
          </Box>
        </Box>
        <Box className={classes['order-div']} component="div">
          <Box className={classes["game-info"]} component="div">
            <Typography className={classes.color} sx={{marginBottom : "10px", wordBreak : "break-word"}} variant="h5">{game.naam}</Typography>
            <Typography className={classes.color} variant="body1">{game.publisher.naam}</Typography>
            <Typography className={classes.color} sx={{marginTop : "10px"}} variant="body1">{game.platform.naam}</Typography>
            <Typography className={classes.color} sx={{marginTop: "50px", fontSize : "20px"}} variant="body1">&euro; {(game.prijs).toFixed(2)}</Typography>
          </Box>
          <Box component="div">
          <FormProvider
            handleSubmit={handleSubmit}
            errors={errors}
            register={register}
          >
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                  <div className={classes.buttons}>
                    <AantalInput style={{marginLeft: "5px", marginRight : "20px",maxWidth : "45px", width : "100%", aspectRatio : "1"}}
                      label="aantal"
                      type="number"
                      defaultValue= "1"
                      validation={validationRules.aantal}
                      data-cy="aantal_input"
                    />
                    <button type="submit" className={classes.button} data-cy="submit_aantal">
                      <ListItemText color="#16abcc" primary="Add to cart"/>
                      <ListItemIcon>
                        <AddShoppingCartIcon />
                      </ListItemIcon>
                    </button>
                  </div>
                  <div className="error">
                    {errors["aantal"] && (
                    <p data-cy="labelinput-error">
                        {errors["aantal"].message}
                    </p>
                    )}
                  </div>
            </form>
          </FormProvider>
          </Box>
        </Box>
      </Box>
      <Box className={classes.addedInfo} >
          <ListItemButton sx={{margin: "10px auto", minWidth: "100%", maxWidth : "100%"}} onClick={handleClickD}>
            <ListItemIcon>
              <DescriptionIcon sx={{marginLeft : "10px"}}/>
            </ListItemIcon>
            <ListItemText primary="Descriptie" />
            {openD ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openD} timeout="auto" unmountOnExit>
            <List sx={{wordBreak: "break-all", height : "auto"}} component="div" disablePadding>
              <Typography sx={{marginBottom: "10px", marginLeft : "10px", marginTop: "10px"}}>{game.descriptie === ""? "Geen descriptie..." : game.descriptie}</Typography>
            </List>
          </Collapse>
      </Box>
      <Box className={classes.addedInfo} >
          <ListItemButton sx={{margin: "10px auto", minWidth: "100%", maxWidth : "100%"}} onClick={handleClickC}>
            <ListItemIcon>
              <CategoryIcon sx={{marginLeft : "10px"}}/>
            </ListItemIcon>
            <ListItemText primary="Categorieen" />
            {openC ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openC} timeout="auto" unmountOnExit>
            <List sx={{height : "auto"}} component="div" disablePadding>
              
                {game.categorieen.length > 0 ?
                <ul>
                {game.categorieen.sort((a, b) => {
                            return a.naam > b.naam;
                      }).map(c => {return (
                        <li key={c.naam}><Typography>{c.naam}</Typography></li>
                      )})}
                       </ul>
                    :
                    <Typography sx={{marginBottom: "10px", marginLeft : "10px", marginTop: "10px"}}>geen categorieen...</Typography>
                      }
            </List>
          </Collapse>
      </Box>
      <Box className={classes.addedInfo} >
          <ListItemButton sx={{margin: "10px auto", minWidth: "100%", maxWidth : "100%"}} onClick={handleClickT}>
            <ListItemIcon>
              <LanguageIcon sx={{marginLeft : "10px"}}/>
            </ListItemIcon>
            <ListItemText primary="Talen" />
            {openC ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={openT} timeout="auto" unmountOnExit>
            <List sx={{height : "auto"}} component="div" disablePadding>
              
                {game.talen.length > 0 ?
                <ul>
                {game.talen.sort((a, b) => {
                            return a.naam > b.naam;
                      }).map(t => {return (
                        <li key={t.naam}><Typography>{t.naam}</Typography></li>
                      )})}
                       </ul>
                    :
                    <Typography sx={{marginBottom: "10px", marginLeft : "10px", marginTop: "10px"}}>geen talen...</Typography>
                      }
            </List>
          </Collapse>
      </Box>
    </Box>
    :
    <></>
}
  </>
  );
}
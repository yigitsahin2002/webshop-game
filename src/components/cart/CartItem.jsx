import { useShoppingCart } from "../../contexts/CartProvider";
import { useGames } from "../../contexts/GamesProvider";

import { makeStyles } from "@material-ui/core";

import { Box } from "@material-ui/core";
import { Typography } from '@mui/material';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useEffect } from "react";

import { useForm, FormProvider } from "react-hook-form";
import AantalInput from "../../components/form-inputs/AantalInput";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const validationRules = {
  aantal: {
    required : "This field is required",
    min : {value : 1, message : "Minimum is 1"},
    max : {value : 1000, message : "Maximum is 1000"},
  }
};

const useStyles = makeStyles(({
  button : {
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#16abcc",
    width : "100%",
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
  totalButtons : {
    cursor : "pointer",
    display : "flex",
    alignItems : "center",
    justifyContent : "center",
    textDecoration : "none",
    color : "#16abcc",
    backgroundColor : "white",
    width : "40px",
    height : "40px",
    border : "1px solid #e1e4e6",
    borderRadius : "50%",
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
    justifyContent : "space-evenly",
    width : "60%",
    padding : "5px",
    marginTop : "20px",
    marginBottom : "20px",
    marginRight : "5px",
  },
  itemInfoTop : {
    paddingTop : "5px",
    maxHeight : "225px"
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
  buttons : {
    display : "flex",
    alignItems : "center",
    justifyContent : "space-evenly",
    margin : "auto",
    width : "60%",
  },
  inputSection : {
    width : "100%",
    display : "grid",
    gridTemplateColumns : "100%",
    gridTemplateRows : "50px 40px",
  },
  error : {
    color : "red",
    textAlign : "center"
  }
}));

export default function CartItem({id, aantal}) {

    const classes = useStyles();

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
      getValues,
    } = useForm();

    const {games} = useGames();
    const {deleteFromCart, changeValueOfOrder} = useShoppingCart();

    const game = games.find(g => g.id === id);

    useEffect(() => {
      reset();
  }, [reset]);

    const onSubmit = useCallback(
      async (data) => {
        
        try {
          game && changeValueOfOrder(id, data[`${game.id}`])
        } catch (error) {
          console.error(error);
        }
      },
      [changeValueOfOrder, game, id]
    );

    const handleDelete = useCallback(() => {
      game && deleteFromCart(game.id);
    }, [deleteFromCart,game])

    const handleIncrease = useCallback(() => {
      setValue(id, Number(getValues(id)) + 1)
    }, [id, getValues, setValue])

    const handleDecrease = useCallback(() => {
      setValue(id, Number(getValues(id)) - 1)
    }, [id, getValues, setValue])

    return (
        <>
        {game &&
            <Box className={classes.item}>
                <Box className={classes.imgContainer}>
                  <img style={{maxHeight : "300px", maxWidth : "225px", width : "100%"}} src={game.imageUri? game.imageUri : "/placeholder.png"} alt={game.id} />
                </Box>
                <Box className={classes.itemInfo}>
                  <Box className={classes.itemInfoTop}>
                    <Typography className={classes.color} sx={{marginBottom : "10px", wordBreak : "break-word"}} variant="h6">{game.naam}</Typography>
                    <Typography className={classes.color} variant="body2">{game.publisher.naam}</Typography>
                    <Typography className={classes.color} sx={{marginTop : "10px"}} variant="body2">{game.platform.naam}</Typography>
                    <Typography className={classes.color} sx={{marginTop: "10px", fontSize : "20px", marginBottom : "20px"}} variant="body1">&euro; {(game.prijs).toFixed(2)}</Typography>
                  </Box>
                  <FormProvider
                    handleSubmit={handleSubmit}
                    errors={errors}
                    register={register}
                  >
                    <form id="shoppingForm" className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                          <div className={classes.inputSection}>
                            <div className={classes.buttons}>
                              <button type="submit" onClick={handleIncrease} className={`${classes.totalButtons}`}>
                                <ListItemIcon>
                                  <AddIcon />
                                </ListItemIcon>
                              </button>
                                <AantalInput style={{minWidth : "35px", maxWidth : "50px", width : "100%", aspectRatio : "1", borderRadius : "40%", border : "1px solid gray"}}
                                  label={game.id}
                                  read={true}
                                  name={game.id}
                                  type="number"
                                  defaultValue= {aantal}
                                  validation={validationRules.aantal}
                                  data-cy="aantal_input"
                                />
                              <button type="submit" onClick={handleDecrease} className={`${classes.totalButtons}`}>
                                <ListItemIcon>
                                  <RemoveIcon />
                                </ListItemIcon>
                              </button>
                            </div>
                            <div className={classes.error}>
                              {errors[`${game.id}`] && (
                                <p data-cy="aantalInput-error">
                                  {errors[`${game.id}`].message}
                                </p>
                              )}
                            </div>
                          </div>
                  </form>
                  </FormProvider>
                  <ListItemButton onClick={handleDelete} className={`${classes.button}`}>
                    <ListItemText color="#16abcc" primary="Delete"/>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                  </ListItemButton>
                </Box>
            </Box>
    }</>
    )
}
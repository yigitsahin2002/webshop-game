import { useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {Link, useHistory } from "react-router-dom";
import LabelInput from "../../components/form-inputs/LabelInput";

import AddIcon from "@mui/icons-material/Add";
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

import { useUsers } from "../../contexts/UsersProvider";
import { useSession } from "../../contexts/AuthProvider";

import { ListItemIcon, ListItemText, makeStyles } from "@material-ui/core"
import { useState } from "react";
import ConfirmDialog from "../../components/user/ConfirmDialog";

import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorMessage from "../../components/error/ErrorMessage";
import { useLogout } from "../../contexts/AuthProvider";
import { Box } from "@mui/system";

const useStyles = makeStyles(theme => ({
  button : {
    cursor : "pointer",
    display : "flex",
    alignItems : "center",
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#16abcc",
    backgroundColor : "white",
    opacity : "100%",
    width : "200px",
    height : "50px",
    margin: "auto",
    marginTop : "15px",
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
  "cancel-button" : {
    cursor : "pointer",
    display : "flex",
    alignItems : "center",
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#16abcc",
    backgroundColor : "white",
    width : "200px",
    height : "50px",
    margin : "auto",
    marginTop : "15px",
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
      }, 
  },
  "cancel-container" : {
    maxWidth : "60%", 
    margin : "0 auto",
    paddingLeft : "0",
    '@media (min-width: 1025px)': {
      maxWidth : "1000px", 
      paddingLeft: "10px",
    }, 
  },
  "delete-button" : {
    cursor : "pointer",
    display : "flex",
    alignItems : "center",
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#16abcc",
    backgroundColor : "white",
    width : "200px",
    height : "50px",
    margin : "auto",
    marginTop : "15px",
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
      }, 
  },
  "delete-container" : {
    maxWidth : "60%", 
    margin : "0 auto",
    paddingLeft : "0",
    '@media (min-width: 1025px)': {
      maxWidth : "1000px", 
      paddingLeft: "10px",
    }, 
  },
  form : {
      maxWidth : "600px",
      width : "90%",
      margin : "auto",
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      padding : "10px 5px"
  },
  inside : {
    maxWidth : "100%",
    width : "100%",
    margin : "auto",
    display : "flex",
    flexGrow : "1",
    flexDirection : "column",
    '& input' : {
        width : "100%"
    }
  },
  inputs : {
    width : "100%",
    display : "flex",
    flexDirection : "column",
  }
}));

const validationRules = {
    naam: {
        required : "This field is required",
        minLength : {value : 2, message : "Alteast 2 characters long"}
    },
    achternaam : {
        required : "This field is required",
        minLength : {value : 2, message : "Alteast 2 characters long"}
    },
    email: {
        required : "This field is required"
    },
};

export default function CategorieForm() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const history = useHistory();
  const { user, setSession, token, error : errorS, setError : setErrorS} = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const {
    updateUser,
    loading,
    error : errorU,
    setError : setErrorU
  } = useUsers();
  const logout = useLogout();

  useEffect(() => {
    if (!user) {
        setSession(token, null);
    }
  }, [user, setSession, token])

  const handleConfirm = useCallback(() => {
    setOpen(true);
  }, [])
  
  const handleCloseConfirm = useCallback(() => {
    setOpen(false);
  }, [])

  const handleError = useCallback(() => {
    setErrorS('');
    setErrorU('');
  }, [setErrorS, setErrorU])

  const handleLogout = useCallback(async () => {
    await logout();
    setErrorS('');
    setErrorU('');
  }, [logout, setErrorS, setErrorU])

  useEffect(() => {
    if (
      // check on non-empty object
      user &&
      (Object.keys(user).length !== 0 ||
      user.constructor !== Object)
    ) {
      //const dateAsString = toDateInputString(new Date(currentTransaction.date));
      setValue("naam", user.naam);
      setValue("achternaam", user.achternaam);
      setValue("email", user.email);
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit = useCallback(
    async (data) => {
      
      try {
          let succes = false;

          if (user) {
            succes = await updateUser({
                id:  user?.id,
                user_naam : data.naam, 
                user_achternaam : data.achternaam,
                user_email : data.email,
              });
          }

          if (succes) {
            setSession(token, null);
            history.push("/home");
          }
      } catch (error) {
        console.error(error);
      }
    },
    [
      updateUser,
      user,
      history,
      setSession,
      token
    ]
  );

  return (
      <>
      {errorS &&
        <Box className="nieuwError">
          <ErrorMessage error={errorS}/>
          {typeof errorS === 'object' && errorS.response?.data && errorS.response.data.code ==='VALIDATION_FAILED'?
            <CloseIcon style={{cursor : "pointer"}} onClick={handleError}/>
            :
            <LogoutIcon style={{cursor : "pointer"}} onClick={handleLogout}/>
          }
        </Box>
      }
      {errorU &&
        <Box className="nieuwError">
          <ErrorMessage error={errorU}/>
          {typeof errorU === 'object' && errorU.response?.data && errorU.response.data.code ==='VALIDATION_FAILED'?
            <CloseIcon style={{cursor : "pointer"}} onClick={handleError}/>
            :
            <LogoutIcon style={{cursor : "pointer"}} onClick={handleLogout}/>
          }
        </Box>
      }
        <FormProvider
        handleSubmit={handleSubmit}
        errors={errors}
        register={register}
        >
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.inside}>
            <div className={classes.inputs}>
                <LabelInput
                label="naam"
                type="text"
                defaultValue=""
                validation={validationRules.naam}
                data-cy="naam_input"
                />

                <LabelInput
                label="achternaam"
                type="text"
                defaultValue=""
                validation={validationRules.achternaam}
                data-cy="achternaam_input"
                />

                <LabelInput
                label="email"
                type="email"
                defaultValue=""
                validation={validationRules.email}
                data-cy="email_input"
                />
            </div>
            <button type="submit" className={classes.button} disabled={loading}  style={{opacity : `${loading? "50%": "100%"}`}} data-cy="submit_game">
                        <ListItemText color="#16abcc" primary="Save user"/>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
            </button>
            </div>
        </form>
            <div className={classes["cancel-container"]}>
                <Link to="/home" style={{textDecoration : "none"}}>
                <button className={classes["cancel-button"]}>
                    <ListItemText color="#16abcc" primary="cancel"/>
                    <ListItemIcon>
                        <CancelIcon />
                    </ListItemIcon>
                </button>
                </Link>
            </div>
            <div className={classes["delete-container"]}>
                <button onClick={handleConfirm} className={classes["delete-button"]}>
                    <ListItemText color="#16abcc" primary="delete account"/>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                </button>
            </div>
            < ConfirmDialog userID={user?.id} open={open} changeOpen={handleCloseConfirm}/>
        </FormProvider>
    </>
    )
}
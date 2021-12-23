import { useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {Link, useParams, useHistory } from "react-router-dom";
import LabelInput from "../../components/form-inputs/LabelInput";

import { usePublishers } from "../../contexts/PublisherProvider";

import AddIcon from "@mui/icons-material/Add";
import CancelIcon from '@mui/icons-material/Cancel';

import { Box, ListItemIcon, ListItemText, makeStyles } from "@material-ui/core";

import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorMessage from "../../components/error/ErrorMessage";
import { useLogout } from "../../contexts/AuthProvider";

const useStyles = makeStyles(({
  button : {
    cursor : "pointer",
    display : "flex",
    alignItems : "center",
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#0400ff",
    backgroundColor : "white",
    opacity : "100%",
    maxWidth : "215px",
    widht : "100%",
    height : "50px",
    margin: "auto",
    marginTop : "15px",
    border : "1px solid #e1e4e6",
    borderRadius : "3px",
    "&:hover" : {
      backgroundColor: "#0400ff",
      color : "white",
      "& svg" : {
        color : "white"
      },
    },
      "& svg" : {
        color : "#0400ff",
        margin : "auto"
      }
  },
  "cancel-button" : {
    cursor : "pointer",
    display : "flex",
    paddingLeft : "15px",
    alignItems : "center",
    textDecoration : "none",
    color : "#0400ff",
    backgroundColor : "white",
    maxWidth : "200px",
    width : "100%",
    height : "50px",
    margin : "auto",
    marginTop : "15px",
    border : "1px solid #e1e4e6",
    borderRadius : "3px",
    "&:hover" : {
      backgroundColor: "#0400ff",
      color : "white",
      "& svg" : {
        color : "white"
      },
    },
      "& svg" : {
        color : "#0400ff",
        margin : "auto"
      }, 
  },
  "cancel-container" : {
    maxWidth : "1000px",
    width : "80%",
    margin : "0 auto",
    paddingLeft : "0",
  },
  form : {
    maxWidth : "600px",
    width : "90%",
    margin : "auto",
    marginTop : "150px",
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
    required : "This field is required"
  }
};

export default function CategorieForm() {
  const classes = useStyles();
  
  const { id } = useParams();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const {
    currentPublisher,
    setPublisherToUpdate,
    createOrUpdatePublisher,
    loading,
    error,
    setError,
  } = usePublishers();
  const logout = useLogout();

  useEffect(() => {
    if (
      // check on non-empty object
      currentPublisher &&
      (Object.keys(currentPublisher).length !== 0 ||
        currentPublisher.constructor !== Object)
    ) {
      //const dateAsString = toDateInputString(new Date(currentTransaction.date));
      setValue("naam", currentPublisher.naam);
    } else {
      reset();
    }
  }, [currentPublisher, setValue, reset]);

  useEffect(() => {
    setPublisherToUpdate(id);
  }, [id, setPublisherToUpdate]);

  const onSubmit = useCallback(
    async (data) => {
      
      try {
        const success = await createOrUpdatePublisher({
          id:  currentPublisher?.id,
          naam_publisher : data.naam
        });

        if (success) {
          setPublisherToUpdate(null);
          history.push("/overview/publishers");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      createOrUpdatePublisher,
      currentPublisher?.id,
      setPublisherToUpdate,
      history,
    ]
  );

  const handleError = useCallback(() => {
    setError('');
  }, [setError])

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout])

  return (
    <> 
      {error && 
        <Box data-cy="error_box" className="nieuwError">
          <ErrorMessage error={error}/>
          {typeof error === 'object' && error.response?.data && error.response.data.code ==='VALIDATION_FAILED'?
            <CloseIcon data-cy="validatie_error_close_btn" style={{cursor : "pointer"}} onClick={handleError}/>
            :
            <LogoutIcon data-cy="unknown_error_logout_btn" style={{cursor : "pointer"}} onClick={handleLogout}/>
          }
        </Box>
      }   
      <FormProvider
        handleSubmit={handleSubmit}
        errors={errors}
        register={register}
      >
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.inside}>
            <Box className={classes.inputs}>
              <LabelInput
                label="naam"
                type="text"
                defaultValue=""
                validation={validationRules.naam}
                data-cy="publishernaam_input"
              />
            </Box>
              <button type="submit" className={classes.button} disabled={loading}  style={{opacity : `${loading? "50%": "100%"}`}} data-cy="submit_publisher">
                  <ListItemText color="#16abcc" primary={currentPublisher? "Save publisher" : "Add publisher"}/>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
              </button>
            </Box>
        </form>
        <Box className={classes["cancel-container"]}>
            <Link className={classes["cancel-button"]} to="/webshop-game/overview/publishers" style={{textDecoration : "none"}}>
                <ListItemText color="#16abcc" primary="cancel"/>
                <ListItemIcon>
                    <CancelIcon />
                </ListItemIcon>
            </Link>
        </Box>
      </FormProvider>
    </>
  )
}
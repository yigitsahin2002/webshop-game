import { useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {Link, useParams, useHistory } from "react-router-dom";
import LabelInput from "../../components/form-inputs/LabelInput";

import { usePlatforms } from "../../contexts/PlatformProvider";


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
    color : "#f2072b",
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
      backgroundColor: "#f2072b",
      color : "white",
      "& svg" : {
        color : "white"
      },
    },
      "& svg" : {
        color : "#f2072b",
        margin : "auto"
      }
  },
  "cancel-button" : {
    cursor : "pointer",
    display : "flex",
    paddingLeft : "15px",
    alignItems : "center",
    textDecoration : "none",
    color : "#f2072b",
    backgroundColor : "white",
    maxWidth : "200px",
    width : "100%",
    height : "50px",
    margin : "auto",
    marginTop : "15px",
    border : "1px solid #e1e4e6",
    borderRadius : "3px",
    "&:hover" : {
      backgroundColor: "#f2072b",
      color : "white",
      "& svg" : {
        color : "white"
      },
    },
      "& svg" : {
        color : "#f2072b",
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

export default function PlatformForm() {
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
    currentPlatform,
    setPlatformToUpdate,
    createOrUpdatePlatform,
    loading,
    error,
    setError,
  } = usePlatforms();
  const logout = useLogout();

  useEffect(() => {
    if (
      // check on non-empty object
      currentPlatform &&
      (Object.keys(currentPlatform).length !== 0 ||
      currentPlatform.constructor !== Object)
    ) {
      //const dateAsString = toDateInputString(new Date(currentTransaction.date));
      setValue("naam", currentPlatform.naam);
    } else {
      reset();
    }
  }, [currentPlatform, setValue, reset]);

  useEffect(() => {
    setPlatformToUpdate(id);
  }, [id, setPlatformToUpdate]);

  const onSubmit = useCallback(
    async (data) => {
      
      try {
        const success = await createOrUpdatePlatform({
          id:  currentPlatform?.id,
          naam_platform : data.naam
        });

        if (success) {
          setPlatformToUpdate(null);
          history.push("/overview/platforms");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      createOrUpdatePlatform,
      currentPlatform?.id,
      setPlatformToUpdate,
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
        <Box className="nieuwError">
          <ErrorMessage error={error}/>
          {typeof error === 'object' && error.response?.data && error.response.data.code ==='VALIDATION_FAILED'?
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
          <Box className={classes.inside}>
            <Box className={classes.inputs}>
              <LabelInput
                label="naam"
                type="text"
                defaultValue=""
                validation={validationRules.naam}
                data-cy="platformnaam_input"
              />
            </Box>
              <button type="submit" className={classes.button} disabled={loading}  style={{opacity : `${loading? "50%": "100%"}`}} data-cy="submit_platform">
                  <ListItemText color="#16abcc" primary={currentPlatform? "Save platform" : "Add platform"}/>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
              </button>
            </Box>
        </form>
        <Box className={classes["cancel-container"]}>
            <Link className={classes["cancel-button"]} to="/overview/platforms" style={{textDecoration : "none"}}>
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
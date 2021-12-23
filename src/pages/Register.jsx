import { useCallback, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import LabelInput from "../components/form-inputs/LabelInput";

import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

import Stack from '@mui/material/Stack';
import { useLogout, useRegister, useSession } from "../contexts/AuthProvider";
import { Box, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core"
import { useHistory } from "react-router";
import ErrorMessage from "../components/error/ErrorMessage";

const useStyles = makeStyles(theme => ({
  button : {
    cursor : "pointer",
    display : "flex",
    alignItems : "center",
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#16abcc",
    backgroundColor : "white",
    width : "40%",
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
  "button-disabled" : {
    cursor : "default",
    display : "flex",
    alignItems : "center",
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#16abcc",
    backgroundColor : "white",
    width : "40%",
    height : "50px",
    border : "1px solid #e1e4e6",
    borderRadius : "3px",
  }
}));

export default function Login() {
  const {loading , error, setError, isAuthed} = useSession();
  const logout = useLogout();

  const classes = useStyles();

  const registerUser = useRegister();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues
  } = useForm();

  const validationRules = useMemo(() => ({
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
    password: {
      required : "This field is required",
      minLength : {value : 5, message : "Alteast 5 characters long"}
    },
    confirmPassword : {
      required : "This field is required",
      validate : {
          nodIdentical : value => {
              const password = getValues('password');
              return password === value ? null : "Both passwords need to be identical"
          }
      }
    }
  }),[getValues]);

  useEffect(() => {
    if (isAuthed) {
      history.replace("/")
    }
  }, [isAuthed, history])

  const onSubmit = useCallback(
    async (data) => {
      
      try {
          const succes = await registerUser({
              naam : data.naam,
              achternaam : data.achternaam,
              email : data.email,
              password : data.password
          });

          if (succes) {
              history.replace('/');
          }

      } catch (error) {
        console.error(error);
      }
    },
    [
      history,
      registerUser
    ]
  );

  const handleCancel = useCallback(() => {
      setError('');
      reset();
  }, [reset, setError])

  const handleError = useCallback(() => {
    setError('');
  }, [setError])

  const handleLogout = useCallback(async () => {
    await logout();
    setError('');
  }, [logout, setError])
  
  return (
    <FormProvider
      handleSubmit={handleSubmit}
      errors={errors}
      register={register}
    >
      {loading && <CircularProgress sx={{position:"absolute", left:"50%", top:"15%"}} />}
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
      <form onSubmit={handleSubmit(onSubmit)} className="loginForm">
        <Typography style={{marginLeft : "10px"}} variant="h4" component="h2">
          Register
        </Typography>
          <div className="login-div">
            <div style={{width : "100%"}}>
                <LabelInput
                  label="naam"
                  type="text"
                  validation={validationRules.naam}
                  data-cy="naam_input"
                />
                <LabelInput
                  label="achternaam"
                  type="text"
                  validation={validationRules.achternaam}
                  data-cy="achternaam_input"
                />
                <LabelInput
                  label="email"
                  type="email"
                  validation={validationRules.email}
                  data-cy="email_input"
                />
                <LabelInput
                  label="password"
                  type="password"
                  defaultValue=""
                  validation={validationRules.password}
                  data-cy="password_input"
                />
                <LabelInput
                  label="confirm password"
                  type="password"
                  defaultValue=""
                  validation={validationRules.confirmPassword}
                  data-cy="password_input"
                />
            </div>
            <Stack component="div" className="login-buttons" direction="row" spacing={2}>
                    <button disabled={loading} type="submit" className={`${loading? classes["button-disabled"] : classes.button}`} data-cy="submit_game">
                      <ListItemText color="#16abcc" primary="Register"/>
                      <ListItemIcon>
                        <AppRegistrationIcon />
                      </ListItemIcon>
                    </button>
                    <button onClick={handleCancel} className={classes.button} data-cy="submit_game">
                      <ListItemText color="#16abcc" primary="Cancel"/>
                      <ListItemIcon>
                        <CancelPresentationIcon />
                      </ListItemIcon>
                    </button>
            </Stack>
          </div>
      </form>
    </FormProvider>
    )
}
import { useCallback, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import LabelInput from "../components/form-inputs/LabelInput";

import LoginIcon from '@mui/icons-material/Login';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';


import Stack from '@mui/material/Stack';
import { useLogin, useLogout, useSession } from "../contexts/AuthProvider";
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

const validationRules = {
  email: {
    required : "This field is required"
  },
  password: {
    required : "This field is required"
  }
};

export default function Login() {
  // const history = useHistory();
  const {loading , error, setError, isAuthed} = useSession();
  const logout = useLogout();

  const classes = useStyles();

  const login = useLogin();
  const history = useHistory();

  useEffect(() => {
    if (isAuthed) {
      history.replace("/")
    }
  }, [isAuthed, history])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = useCallback(
    async (data) => {
      
      try {
        const success = await login(data.email, data.password);

        if (success) {
          history.replace("/");
        }

      } catch (error) {
        console.error(error);
      }
    },
    [
      history,
      login
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
      {loading && <CircularProgress sx={{position:"absolute", left:"50%", top:"25%"}} />}
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
          Sign in
        </Typography>
          <div className="login-div">
            <div style={{width : "100%"}}>
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
            </div>
            <Stack component="div" className="login-buttons" direction="row" spacing={2}>
                    <button disabled={loading} type="submit" className={`${loading? classes["button-disabled"] : classes.button}`} style={{opacity : `${loading? "40%" : "100%"}`, cursor : `${loading? "default" : "pointer"}`}} data-cy="submit_login">
                      <ListItemText color="#16abcc" primary="Login"/>
                      <ListItemIcon>
                        <LoginIcon />
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
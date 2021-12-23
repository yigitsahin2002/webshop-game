import { useEffect, useCallback, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {Link, useParams, useHistory } from "react-router-dom";
import LabelInput from "../../components/form-inputs/LabelInput";

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, makeStyles } from "@material-ui/core"
import { useBestellingen } from "../../contexts/BestellingenProvider";

import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorMessage from "../../components/error/ErrorMessage";
import { useLogout } from "../../contexts/AuthProvider";

const useStyles = makeStyles(theme => ({
  button : {
    cursor : "pointer",
    display : "flex",
    alignItems : "center",
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#16abcc",
    backgroundColor : "white",
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
  cancelLink : {
    textDecoration : "none", 
    width : "100%", 
    display : "flex", 
    color : "#16abcc",
    '&:hover' : {
        color : "white",
    }
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
  error : {
    color : "red",
    marginLeft : "15px",
    padding: "0",
  },
  "input-container" : {
    display: "grid",
    maxWidth: "100%",
    flexWrap: "wrap"
  },
  form : {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        maxWidth: "80%",
        width : "100%",
        gap: "20px",
        paddingBottom: "10px",
        borderRadius: "10px",
        backgroundColor: "white",
        boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
        margin: "150px auto 0",
        height: "auto",
        '@media (min-width: 900px)': {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            maxWidth: "700px",
            minWidth: "345px",
        },
  }
}));

const toDateInputString = (date) => {
  // (toISOString returns something like 2020-12-05T14:15:74Z,
  // date HTML5 input elements expect 2020-12-05
  //
  if (!date) return null;
  if (typeof date !== Object) {
    date = new Date(date);
  }
  const asString = date.toISOString();
  return asString.substring(0, asString.indexOf("T"));
};

export default function BestellingenForm() {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm();
  const logout = useLogout();

  const {
    currentBestelling,
    setBestellingToUpdate,
    createOrUpdateBestelling,
    error,
    setError,
    loading
  } = useBestellingen();

  const validationRules = useMemo(() => ({
    aantal: {
      required : "This field is required",
      min : {value : 1, message : "Minimum is 1"},
      max : {value : 1000, message : "Maximum is 1000"},
      valueAsNumber: true,
    },
    datum : {
        required : "This field is required",
        validate : {
          nodIdentical : value => {
              const date = getValues('datum');
              return new Date(date) > new Date() ? "Please choose a date in the past" : null;
          }
      }
    }
  }), [getValues]);

  useEffect(() => {
    if (
      // check on non-empty object
      currentBestelling &&
      (Object.keys(currentBestelling).length !== 0 ||
      currentBestelling.constructor !== Object)
    ) {
      const dateAsString = toDateInputString(new Date(currentBestelling.datum));

      setValue("aantal", currentBestelling.aantal);
      setValue("datum", dateAsString);

    } else {
      reset();
      // reset ook de andere cats, talen en publisher
    }
  }, [currentBestelling, setValue, reset]);

  useEffect(() => {
    setBestellingToUpdate(id);
  }, [id, setBestellingToUpdate]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        const succes = await createOrUpdateBestelling({
          id: currentBestelling?.id,
          aantal : data.aantal,
          datum : new Date(data.datum)
        });

        if (succes) {
            setBestellingToUpdate(null);
            history.push("/bestellingen");
        }

      } catch (error) {
        console.error(error);
      }
    },
    [
      createOrUpdateBestelling,
      currentBestelling?.id,
      setBestellingToUpdate,
      history,
    ]
  );

  const handleError = useCallback(() => {
    setError('');
  }, [setError])

  const handleLogout = useCallback(async () => {
    await logout();
    setError('');
  }, [logout, setError])

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
            <div className={classes["input-container"]}>
              <LabelInput
                label="aantal"
                type="number"
                validation={validationRules.aantal}
                data-cy="gamenaam_input"
              />
              <LabelInput
                  label="datum"
                  type="date"
                  defaultValue={toDateInputString(new Date())}
                  validation={validationRules.datum}
                  data-cy="date_input"
              />
              </div>
              <button disabled={loading} type="submit" className={classes.button} style={{opacity : `${loading? "50%" : "100%"}`}} data-cy="sumbit_bestelling">
                  <ListItemText color="#16abcc" primary="Save bestelling"/>
                  <ListItemIcon>
                  <AddIcon />
                  </ListItemIcon>
              </button>
        </form>
        <div className={classes["cancel-container"]}>
            <button className={classes["cancel-button"]}>
              <Link className={classes.cancelLink} to="/bestellingen">
                  <ListItemText color="#16abcc" primary="cancel"/>
                  <ListItemIcon>
                      <CancelIcon />
                  </ListItemIcon>
              </Link>
            </button>
        </div>
      </FormProvider>
    </>
  )
}
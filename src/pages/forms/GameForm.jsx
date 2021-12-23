import { useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {Link, useParams, useHistory } from "react-router-dom";
import LabelInput from "../../components/form-inputs/LabelInput";
import LabelSelect from "../../components/form-inputs/LabelSelect";
import LabelCheckbox from "../../components/form-inputs/LabelCheckbox";
import LabelDoubleInput from "../../components/form-inputs/LabelDoubleInput";
import LabelTextArea from "../../components/form-inputs/LabelTextArea"
import { useGames } from "../../contexts/GamesProvider";
import { useCategorieen } from "../../contexts/CategorieProvider";
import { usePublishers } from "../../contexts/PublisherProvider";
import { usePlatforms } from "../../contexts/PlatformProvider";
import { useTalen } from "../../contexts/TaalProvider";

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, makeStyles } from "@material-ui/core"

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
  }
}));

const validationRules = {
  naam: {
    required : "This field is required",
    minLength : {value : 5, message : "Min 5 characters long"}
  },
  prijs : {
    required : "This field is required",
    min : {value : 1, message : "Minimum is 1"},
    max : {value : 1000, message : "Maximum is 1000"},
  },
  platform : {
    required : "This field is required"
  },
  publisher : {
    required : "This field is required"
  },
  descriptie : {
    maxLength : {value : 500, message : "Max 500 characters long"}
  },
  imageUri : {
    maxLength : {value : 220, message : "Max 220 characters long"}
  }
};

export default function GameForm() {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors
  } = useForm();

  const {
    currentGame,
    setGameToUpdate,
    createOrUpdateGame,
    loading,
    error : errorG,
    setError : setErrorG
  } = useGames();
  const logout = useLogout();

  const {categorieen, error : errorC, setError : setErrorC} = useCategorieen();
  const {publishers, error : errorPu, setError : setErrorPu} = usePublishers();
  const {platforms, error : errorPl, setError : setErrorPl} = usePlatforms();
  const {talen, error : errorT, setError : setErrorT} = useTalen();

  useEffect(() => {
    if (
      // check on non-empty object
      currentGame &&
      (Object.keys(currentGame).length !== 0 ||
        currentGame.constructor !== Object)
    ) {
      //const dateAsString = toDateInputString(new Date(currentTransaction.date));
      setValue("naam", currentGame.naam);
      setValue("prijs", currentGame.prijs);
      setValue("descriptie", currentGame.descriptie ?? "");

      for (const categorie of categorieen) {
        setValue(`${categorie.naam}`, currentGame?.categorieen?.map(c => c.naam).indexOf(categorie.naam) === -1? false : true )
      }
    
      for (const taal of talen) {
      setValue(`${taal.naam}`, currentGame?.talen?.map(t => t.naam).indexOf(taal.naam) === -1? false : true )
      }

      const p = platforms.find(p => p.naam === currentGame.platform.naam)?.id
      setValue("platform", `${p}`);
    
      const publ = publishers.find(p => p.naam === currentGame.publisher.naam)?.id
      setValue("publisher", `${publ}`);

      //setValue("platform_game", currentGame.platform);
      setValue("imageUri", currentGame.imageUri ?? "");
    } else {
      reset();
      // reset ook de andere cats, talen en publisher
    }
  }, [currentGame, categorieen, publishers, platforms, talen, setValue, reset]);

  useEffect(() => {
    setGameToUpdate(id);
  }, [id, setGameToUpdate]);

  const onSubmit = useCallback(
    async (data) => {
      let proceed = true;
      clearErrors("categorieen");
      clearErrors("talen");
      try {
        let categorieenSelected = [];
        let talenSelected = [];

        for (const c of categorieen){
          if (data.hasOwnProperty(`${c.naam}`)){
            data[c.naam] && categorieenSelected.push({id_categorie : categorieen.find(cat => cat.naam === c.naam)?.id})
          }
        }

        for (const t of talen){
          if (data.hasOwnProperty(`${t.naam}`)){
            data[t.naam] && talenSelected.push({id_taal : talen.find(tal => tal.naam === t.naam)?.id})
          }
        }

        if (categorieenSelected.length === 0) {
          proceed = false;

          setError("categorieen", {
            type: "manual",
            message: "Please select atleast one categorie...",
          });
        } 

        if (!talenSelected.length > 0) {
          proceed = false;

          setError("talen", {
            type: "manual",
            message: "Please select atleast one taal...",
          });
        }

        if (proceed) {
          const platform = platforms.find(p => p.id === data.platform)
          const publisher = publishers.find(p => p.id === data.publisher)

        const success = await createOrUpdateGame({
          id: currentGame?.id,
          naam_game : data.naam,
          prijs_game : data.prijs,
          descriptie_game: data.descriptie,
          id_platform : platform.id, //data.platform,
          imageUri_game : data.imageUri, //data.imageUri,
          id_publisher : publisher.id,
          categorieen : categorieenSelected,
          talen : talenSelected
        });

        if (success) {
          setGameToUpdate(null);
          history.push("/overview/games");
        }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      createOrUpdateGame,
      currentGame?.id,
      setGameToUpdate,
      categorieen,
      publishers,
      platforms,
      talen,
      history,
      clearErrors,
      setError
    ]
  );

  const handleError = useCallback(() => {
    setErrorG('');
    setErrorC('');
    setErrorPu('');
    setErrorPl('');
    setErrorT('');
  }, [setErrorG, setErrorC, setErrorPu, setErrorPl, setErrorT])

  const handleLogout = useCallback(async () => {
    await logout();
    setErrorG('');
    setErrorC('');
    setErrorPu('');
    setErrorPl('');
    setErrorT('');
  }, [logout, setErrorG, setErrorC, setErrorPu, setErrorPl, setErrorT])

  return (
    <>
        {errorG &&
          <Box className="nieuwError">
            <ErrorMessage error={errorG}/>
            {typeof errorG === 'object' && errorG.response?.data && errorG.response.data.code ==='VALIDATION_FAILED'?
              <CloseIcon style={{cursor : "pointer"}} onClick={handleError}/>
              :
              <LogoutIcon style={{cursor : "pointer"}} onClick={handleLogout}/>
            }
          </Box>
        }
        {errorC &&
          <Box className="nieuwError">
            <ErrorMessage error={errorC}/>
            {typeof errorC === 'object' && errorC.response?.data && errorC.response.data.code ==='VALIDATION_FAILED'?
              <CloseIcon style={{cursor : "pointer"}} onClick={handleError}/>
              :
              <LogoutIcon style={{cursor : "pointer"}} onClick={handleLogout}/>
            }
          </Box>
        }
        {errorPu &&
          <Box className="nieuwError">
            <ErrorMessage error={errorPu}/>
            {typeof errorPu === 'object' && errorPu.response?.data && errorPu.response.data.code ==='VALIDATION_FAILED'?
              <CloseIcon style={{cursor : "pointer"}} onClick={handleError}/>
              :
              <LogoutIcon style={{cursor : "pointer"}} onClick={handleLogout}/>
            }
          </Box>
        }
        {errorPl &&
          <Box className="nieuwError">
            <ErrorMessage error={errorPl}/>
            {typeof errorPl === 'object' && errorPl.response?.data && errorPl.response.data.code ==='VALIDATION_FAILED'?
              <CloseIcon style={{cursor : "pointer"}} onClick={handleError}/>
              :
              <LogoutIcon style={{cursor : "pointer"}} onClick={handleLogout}/>
            }
          </Box>
        }
        {errorT &&
          <Box className="nieuwError">
            <ErrorMessage error={errorT}/>
            {typeof errorT === 'object' && errorT.response?.data && errorT.response.data.code ==='VALIDATION_FAILED'?
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
        <form className="gameform" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-container">
              <LabelInput
                label="naam"
                type="text"
                defaultValue=""
                validation={validationRules.naam}
                data-cy="gamenaam_input"
              />
              <LabelDoubleInput
                label="prijs"
                type="number"
                defaultValue= "0"
                validation={validationRules.prijs}
                data-cy="prijs_input"
              />
              <LabelSelect
                label="platform"
                options={platforms}
                validation={validationRules.platform}
                data-cy="platform_input"
              />
              <LabelSelect
                label="publisher"
                current={currentGame}
                options={publishers}
                validation={validationRules.publisher}
                data-cy="platform_input"
              />
                <LabelTextArea
                label="descriptie"
                defaultValue= ""
                validation={validationRules.descriptie}
                data-cy="descriptie_input"
              />
                <LabelTextArea
                label="imageUri"
                validation={validationRules.imageUri}
                defaultValue=""
                data-cy="gamenaam_input"
              />
              </div>
              <div className="input-checkbox" {...register("categorieen")}>
                <label className="checkbox_lbl" htmlFor="categorie_label">categorieen:</label>
                <div className="checkboxes">
                  {categorieen && categorieen.sort((a, b) => {
                          return a.naam > b.naam;
                    }).map(c => {
                    return (
                      <LabelCheckbox key={c.id}
                        label= {c.naam}
                        type="checkbox"
                        //Validation
                        data-cy={`checkbox_${c.naam}`}
                      />
                    )
                  })}
                </div>
              </div>
              {errors["categorieen"] && (
                <p className={classes.error} data-cy="labelcheckbox-error">
                  {errors["categorieen"].message}
                </p>
              )}
              <div className="input-checkbox" {...register("talen")}>
              <label className="checkbox_lbl" htmlFor="taal_label">talen:</label>
                <div className="checkboxes">
                  {talen && talen.sort((a, b) => {
                          return a.naam > b.naam;
                    }).map(t => {
                    return (
                      <LabelCheckbox key={t.id}
                        label= {t.naam}
                        type="checkbox"
                        //Validation
                        data-cy={`checkbox_${t.naam}`}
                      />
                    )
                  })}
                </div>
              </div>

              {errors["talen"] && (
                <p className={classes.error} data-cy="labelcheckbox-error">
                  {errors["talen"].message}
                </p>
              )}
                    {currentGame?.id
                      ?
                      <button type="submit" className={classes.button} disabled={loading}  style={{opacity : `${loading? "50%": "100%"}`}} data-cy="submit_game">
                        <ListItemText color="#16abcc" primary="Save game"/>
                        <ListItemIcon>
                          <AddIcon />
                        </ListItemIcon>
                      </button>
                      : 
                      <button type="submit" className={classes.button} disabled={loading}  style={{opacity : `${loading? "50%": "100%"}`}} data-cy="submit_game">
                        <ListItemText color="#16abcc" primary="Add game"/>
                        <ListItemIcon>
                          <AddIcon />
                        </ListItemIcon>
                      </button>
                    }
        </form>
        <div className={classes["cancel-container"]}>
          <Link to="/webshop-game/overview/games" style={{textDecoration : "none"}}>
            <button className={classes["cancel-button"]}>
              <ListItemText color="#16abcc" primary="cancel"/>
              <ListItemIcon>
                <CancelIcon />
              </ListItemIcon>
            </button>
          </Link>
        </div>
      </FormProvider>
    </>
  )
}
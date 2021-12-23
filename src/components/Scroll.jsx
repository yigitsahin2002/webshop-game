import { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core"
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IconButton } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    toTop : {
        borderRadius : "50%",
        transform : "scale(1.5)",
        zIndex : 2,
        position : "fixed",
        bottom : "2vh",
        right : "30px",
        opacity : "50%",
        backgroundColor : "#212121",
        color : "white",
        "&:hover, &.Mui-focusVisible" : {
            transition : "0.3s",
            opacity : "100%",
            color : "#212121",
            backgroundColor : "white",
            border: "1px solid #212121"
        }
    }
}))

export default function Scroll ({showBelow}) {

    const classes = useStyles();
    const [show, setShow] = useState(showBelow ? false : true);

    const handleScroll = useCallback(() => {
        if (window.scrollY > showBelow){
            if (!show) setShow(true)
        } else {
            if (show) setShow(false)
        }
    }, [show, showBelow])

    useEffect(() => {
        if (showBelow) {
            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll, showBelow])

    const handleClick = useCallback(() => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
          });
    }, []);

    return (
        <div>
            {show &&
            <IconButton className={classes.toTop} onClick={handleClick}>
                <ExpandLessIcon />
            </IconButton>
            }
        </div>
    )
}

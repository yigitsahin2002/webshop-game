import Pagination from "@material-ui/lab/Pagination"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    root : {
        display : "flex",
        "justify-content" : "center",
        margin : "0",
        zIndex: "200",
        border : "1px 1px 0 0 solid black",
        backgroundColor : "white",
        "max-width": "100%",
        padding : "10px 0",
        "overflow-x" : "hidden",
        "& nav": {
            margin: "0",
            "& ul" : {
                "& li": {
                    "&:first-child" : {
                        textContent : "Previous"
                    },
                    "&:last-child" : {
                        content : "Next"
                    },
                    "& button" : {
                        borderRadius: "10px",
                        border : "1px solid black",
                        "&:hover" : {
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                        }
                    }
                }
            }
        }
    },
    /* [theme.breakpoints.up('md')]: {
        root : {
            backgroundColor : 'black'
        }
    } */
    container : {
        padding: "0",
        margin : "20px 0 0 0",
    }
}));

const ListPagination = ({currentPage, setPageNumber = (f) => f, totalPages}) => {
    const classes = useStyles()
    
    const handleChange = (event, value) => {
        setPageNumber(value);
        window.scroll({
            top : 0,
            behavior : "smooth",
          })
    }
    return (
            <div className={classes.container}>
                <div className={classes.root}>
                    <Pagination
                    
                    variant="text"
                    count={totalPages}
                    onChange={handleChange}
                    page={currentPage ?? 0}/>
                </div>
            </div>
    )
}

export default ListPagination;
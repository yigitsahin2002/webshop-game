import { useShoppingCart } from "../../contexts/CartProvider";
import { useBestellingen } from "../../contexts/BestellingenProvider";

import CartItem from "../cart/CartItem"
import CircularProgress from '@mui/material/CircularProgress';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { makeStyles } from "@material-ui/core"
import { useSession } from "../../contexts/AuthProvider";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useGames } from "../../contexts/GamesProvider";
import { useHistory } from "react-router";

const useStyles = makeStyles(({
  outerContainer : {
    margin : "auto",
    maxWidth : "1000px",
    width : "99%",
  },
  button : {
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#16abcc",
    width : "150px",
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
  footerButton : {
    paddingLeft : "15px",
    textDecoration : "none",
    color : "#16abcc",
    width : "50%",
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
  spinner : {
    position : "absolute",
    top : "50%",
    left : "50%",
    transform : "translate(-50%, 50%)"
  },
  shoppingFooter : {
    width : "100%",
    height : "auto",
    marginTop : "20px",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    borderRadius : "10px 10px 0 0",
    paddingBottom : "10px"
  },
  shoppingFooterButtons : {
    display : "flex",
    flexDirection : "row",
    justifyContent : "space-between",
    padding : "5px"
  },
  totaal : {
    maxWidth : "1000px",
    display : "flex",
    justifyContent : "space-between",
    padding: "15px",
    margin : "0",
    borderRadius : "10px 10px 0 0",
    backgroundColor : "rgba(22, 171, 204, 0.8)"
  }
}));

export default function Cart() {
    const classes = useStyles();
    const history = useHistory();
    const {shoppingCart, loading, error, emptyShoppingCart} = useShoppingCart();
    const { user } = useSession();
    const { games } = useGames();
    const [totalPrice, setTotalPrice] = useState(0);

    const { createOrUpdateBestelling } = useBestellingen();

    useEffect(() => {
      let sum = 0;

      if (shoppingCart) {
        for (const item of shoppingCart) {
          const game = games.find(g => g.id === item.id);
  
          if (game) {
            sum += (game?.prijs * item.aantal);
          }
        }
      }

      setTotalPrice(sum.toFixed(2));
    }, [games, shoppingCart])

    const handleReturn = useCallback(() => {
      history.push("/browse/games")
    }, [history])

    const handlePurchase = useCallback(async () => {
      let success = true;
      for (const item of shoppingCart) {
        success = await createOrUpdateBestelling({
          gameID : item.id,
          aantal : item.aantal,
          datum : new Date()
        })
      }

      if (success) {
        emptyShoppingCart();
        history.push("/browse/games");
      }
    }, [shoppingCart, createOrUpdateBestelling, emptyShoppingCart, history]);

    if (loading) return (
        <div className={classes.spinner} data-cy="loading">
          <CircularProgress />
        </div>
      )
    if (error)
      return (
        <p data-cy="games_error" className="error">
          {JSON.stringify(error, null, 2)}
        </p>
      );
    
      if (!shoppingCart || !shoppingCart.length > 0) {
        return (
            <p className="noneLeft">Shopping cart is empty...</p>
        );
      }

    return (
        <>
        <Box component="div" className={classes.outerContainer}>
          <Box sx={{maxWidth : "1000px", width : "99%", textAlign : "center"}}>
            <Typography sx={{marginBottom : "50px"}} variant="h4" >
              {user ? `${user.naam}'s shopping cart` : "loading user..."}
              </Typography>
          </Box>
          <Stack>
            {shoppingCart.map(({id, aantal}) => {
                return (
                  <CartItem key={id + aantal} id={id} aantal={aantal}/>
                )
            })}
          </Stack>
          <Box className={classes.shoppingFooter}>
            <Stack className={classes.totaal} direction="row">
              <Typography variant="h5">Totaal</Typography>
              <Typography variant="h5">&euro; {totalPrice.toString().replace('.', ',')}</Typography>
            </Stack>
            <Box>
            <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Game</TableCell>
            <TableCell align="right">Aantal</TableCell>
            <TableCell align="right">Game prijs (&euro;)</TableCell>
            <TableCell align="right">Totaal per spel (&euro;)</TableCell>
          </TableRow>
        </TableHead>
         <TableBody>
          {shoppingCart.sort((a, b) => {return a.aantal < b.aantal})
            .map((row) => (
              <TableRow
                key={row.id + row.aantal}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {games.find(g => g.id === row.id)?.naam}
                </TableCell>
                <TableCell align="right">{row.aantal}</TableCell>
                <TableCell align="right">{games.find(g => g.id === row.id)?.prijs.toFixed(2).toString().replace('.',',')}</TableCell>
                <TableCell align="right">{(games.find(g => g.id === row.id)?.prijs.toFixed(2) * row.aantal).toFixed(2).toString().replace(".",",")}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
            </Box>
            <hr />
            <Box className={classes.shoppingFooterButtons}>
              <ListItemButton onClick={handleReturn} className={`${classes.footerButton}`}>
                <ListItemText color="#16abcc" primary="< verder winkelen"/>
              </ListItemButton>
              <ListItemButton onClick={handlePurchase} className={`${classes.footerButton}`}>
                <ListItemText color="#16abcc" primary="Bestellen"/>
                <ListItemIcon>
                  <ShoppingBasketIcon />
                </ListItemIcon>
              </ListItemButton>
            </Box>
          </Box>
        </Box>
        </>
    )
}
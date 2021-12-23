import { useEffect} from 'react';
import './App.css';

import Games from "./pages/Games"
import GameInfo from './components/game/GameInfo';

import Categorieen from './pages/Categorieen';

import Publishers from './pages/Publishers';

import Platforms from './pages/Platforms';

import Talen from "./pages/Talen";

import GameForm from './pages/forms/GameForm';
import CategorieForm from './pages/forms/CategorieForm';
import PublisherForm from "./pages/forms/PublisherForm";
import PlatformForm from "./pages/forms/PlatformForm";
import TaalForm from "./pages/forms/TaalForm";
import UserInfoForm from "./pages/forms/UserInfoForm";

import BreadCrumbSection from './components/bread/BreadCrumbSection';

import Home from './components/Home';
import Browse from './pages/Browse';
import Cart from "./components/cart/Cart"
import Overview from "./pages/Overview";
import NavHeader from './components/navigation/NavHeader';

import { useGames } from './contexts/GamesProvider';
import { useCategorieen } from "./contexts/CategorieProvider";
import { usePublishers } from './contexts/PublisherProvider';
import { Switch, Route, Redirect} from 'react-router-dom';
import { usePlatforms } from './contexts/PlatformProvider';
import { useTalen } from './contexts/TaalProvider';
import { useSession } from "./contexts/AuthProvider";
import Login from './pages/Login';
import Register from './pages/Register';

import PrivateRoute from "./components/PrivateRoute";
import Bestellingen from './pages/Bestellingen';
import BestellingenForm from "./pages/forms/BestellingenForm";;

function App() {
  const {games, refreshGames} = useGames();
  const {categorieen} = useCategorieen();
  const {publishers} = usePublishers();
  const {platforms} = usePlatforms();
  const {talen} = useTalen();

  const { ready : authReady } = useSession();

  useEffect( () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [])
  
  useEffect(() => {
    async function refresh() {
      await refreshGames();
    }

    if (authReady) refresh();
  }, [categorieen, publishers, refreshGames, platforms, talen, authReady])

    return (<>
    <NavHeader/>
    <BreadCrumbSection/>
    <Switch>

      
      <Route exact path="/login">
            <Login />
      </Route>

      <Route exact path="/register">
            <Register />
      </Route>

      <Route exact path="/">
        <Redirect to="/webshop-game" />
      </Route>

      <PrivateRoute exact path="/webshop-game/winkelmandje">
        <Cart/>
      </PrivateRoute>

      <PrivateRoute exact path="/webshop-game">
            <Home />
      </PrivateRoute>

      <PrivateRoute exact path="/webshop-game/user/info">
            <UserInfoForm />
      </PrivateRoute>

      <PrivateRoute exact path="/webshop-game/bestellingen">
            <Bestellingen />
      </PrivateRoute>

      <PrivateRoute exact path="/webshop-game/bestellingen/edit/:id">
            <BestellingenForm />
      </PrivateRoute>

      <PrivateRoute path="/webshop-game/browse" exact>
            <Browse />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/browse/games" exact>
        <Games editMode={false}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/browse/games/:id" exact>
        <GameInfo games={games}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/browse/categorieen" exact>
        <Categorieen editMode={false}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/browse/platforms" exact>
        <Platforms editMode={false}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/browse/publishers" exact>
        <Publishers editMode={false}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/browse/talen" exact>
        <Talen editMode={false}/>
      </PrivateRoute>

      <PrivateRoute path="/webshop-game/overview" role="admin" exact>
        <Overview />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/games" role="admin" exact>
        <Games editMode={true}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/categorieen" role="admin" exact>
        <Categorieen editMode={true}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/publishers" role="admin" exact>
        <Publishers editMode={true}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/platforms" role="admin" exact>
        <Platforms editMode={true}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/talen" role="admin" exact>
        <Talen editMode={true}/>
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/games/edit/:id" role="admin" exact>
        <GameForm />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/games/add" role="admin" exact>
        <GameForm />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/categorieen/edit/:id" role="admin" exact>
        <CategorieForm />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/categorieen/add" role="admin" exact>
        <CategorieForm />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/platforms/edit/:id" role="admin" exact>
        <PlatformForm />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/platforms/add" role="admin" exact>
        <PlatformForm />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/publishers/edit/:id" role="admin" exact>
        <PublisherForm />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/publishers/add" role="admin" exact>
        <PublisherForm />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/talen/edit/:id" role="admin" exact>
        <TaalForm />
      </PrivateRoute>
      <PrivateRoute path="/webshop-game/overview/talen/add" role="admin" exact>
        <TaalForm />
      </PrivateRoute>
      <Route path="*">
        <h1>404 NOT FOUND</h1>
      </Route>
    </Switch>
    </>
  );
}

export default App;

import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo
  } from 'react';

  import * as gameApi from "../api/games";
import { useSession } from './AuthProvider';

  export const GamesContext = createContext();
  export const useGames = () => useContext(GamesContext);

  export const GamesProvider = ({
    children
  }) => {
    const [initialLoad, setInitialLoad] = useState(false);
    const [currentGame, setCurrentGame] = useState({});
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState([]);

    const { ready : authReady } = useSession();

    const refreshGames = useCallback(async () => {
      try {
        setError('');
        setLoading(true);
        const data = await gameApi.getAllGames();
        setGames(data.data);
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }

    }, []);

    useEffect(() => {
      if (authReady && !initialLoad) {
        refreshGames();
        setInitialLoad(true);
      }
    }, [authReady, initialLoad, refreshGames]);

    const createOrUpdateGame = useCallback(async ({
      id,
      naam_game,
      prijs_game,
      descriptie_game,
      id_platform,
      imageUri_game,
      id_publisher,
      categorieen,
      talen
    }) => {
      setError('');
      setLoading(true);
    try {
        await gameApi.saveGame({
          id,
          naam_game,
          prijs_game,
          descriptie_game,
          id_platform,
          imageUri_game,
          id_publisher,
          categorieen,
          talen
        })
        await refreshGames();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshGames]);

    const deleteGame = useCallback(async (id) => {
      try {
        setLoading(true);
        setError('');
        await gameApi.deleteGame(id);
        await refreshGames();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshGames]);

    const setGameToUpdate = useCallback(
      (id) => {
        setCurrentGame(
          id === null ? {} : games.find((t) => t.id === id)
        );
      },
      [games]
    );

    const value = useMemo(() => ({
      refreshGames,
      currentGame,
      setCurrentGame,
      games,
      error,
      setError,
      loading,
      setLoading,
      deleteGame,
      createOrUpdateGame,
      setGameToUpdate
    }), [refreshGames, games, error, setError, loading,setLoading, setCurrentGame, deleteGame, currentGame, createOrUpdateGame, setGameToUpdate])

    return (
      <GamesContext.Provider value={value}>
        {children}
      </GamesContext.Provider>
    );
  };
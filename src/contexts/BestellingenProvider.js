import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo
  } from 'react';

  import * as bestellingApi from "../api/bestellingen";
  import { useSession } from './AuthProvider';

  export const bestellingenContext = createContext();
  export const useBestellingen = () => useContext(bestellingenContext);

  export const BestellingenProvider = ({
    children
  }) => {
    const [initialLoad, setInitialLoad] = useState(false);
    const [currentBestelling, setCurrentBestelling] = useState({});
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [bestellingen, setBestellingen] = useState([]);

    const { ready : authReady } = useSession();

    const refreshBestellingen = useCallback(async () => {
      try {
        setError('');
        setLoading(true);
        const data = await bestellingApi.getAllBestellingen();
        setBestellingen(data.data);
        return true
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }

    }, []);

    useEffect(() => {
      if (authReady && !initialLoad) {
        refreshBestellingen();
        setInitialLoad(true);
      }
    }, [authReady, initialLoad, refreshBestellingen]);

    const createOrUpdateBestelling = useCallback(async ({
      id,
      gameID,
      aantal,
      datum
    }) => {
      setError('');
      setLoading(true);
    try {
        await bestellingApi.saveBestelling({
            id,
            gameID,
            aantal,
            datum
        })
        await refreshBestellingen();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshBestellingen]);

    const deleteBestelling = useCallback(async (id) => {
      try {
        setLoading(true);
        setError('');
        await bestellingApi.deleteBestelling(id);
        refreshBestellingen();
        return true;
      } catch (error) {
        setError(error)
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshBestellingen]);

    const setBestellingToUpdate = useCallback(
      (id) => {
        setCurrentBestelling(
          id === null ? {} : bestellingen.find((t) => t.id === id)
        );
      },
      [bestellingen]
    );

    const value = useMemo(() => ({
      refreshBestellingen,
      currentBestelling,
      setCurrentBestelling,
      bestellingen,
      error,
      setError,
      loading,
      setLoading,
      deleteBestelling,
      createOrUpdateBestelling,
      setBestellingToUpdate
    }), [refreshBestellingen, bestellingen, error, setError, loading ,setLoading, setCurrentBestelling, deleteBestelling, currentBestelling, createOrUpdateBestelling, setBestellingToUpdate])

    return (
      <bestellingenContext.Provider value={value}>
        {children}
      </bestellingenContext.Provider>
    );
  };
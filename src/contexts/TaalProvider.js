import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo
  } from 'react';

import * as taalApi from "../api/talen";
import { useSession } from './AuthProvider';

  export const TaalContext = createContext();
  export const useTalen = () => useContext(TaalContext);

  export const TaalProvider = ({
    children
  }) => {
    const [initialLoad, setInitialLoad] = useState(false);
    const [currentTaal, setCurrentTaal] = useState({});
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [talen, setTalen] = useState([]);

    const { ready : authReady } = useSession();

    const refreshTalen = useCallback(async () => {
      try {
        setError('');
        setLoading(true);
        const data = await taalApi.getAllTalen();
        setTalen(data.data);
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
        refreshTalen();
        setInitialLoad(true);
      }
    }, [authReady, initialLoad, refreshTalen]);

    const createOrUpdateTaal = useCallback(async ({
      id,
      naam_taal
    }) => {
      setError('');
      setLoading(true);
      try {
        await taalApi.saveTaal({id, naam_taal});
        await refreshTalen();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshTalen]);

    const deleteTaal = useCallback(async (id) => {
      setLoading(true);
      setError();
      try {
        await taalApi.deleteTaal(id);
        await refreshTalen();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshTalen]);

    const setTaalToUpdate = useCallback(
      (id) => {
        setCurrentTaal(
          id === null ? {} : talen.find((t) => t.id === id)
        );
      },
      [talen]
    );

    const value = useMemo(() => ({
      currentTaal,
      setCurrentTaal,
      talen,
      error,
      setError,
      loading,
      deleteTaal,
      createOrUpdateTaal,
      setTaalToUpdate
    }), [talen, error, setError, loading, setCurrentTaal, deleteTaal, currentTaal, createOrUpdateTaal, setTaalToUpdate])

    return (
      <TaalContext.Provider value={value}>
        {children}
      </TaalContext.Provider>
    );
  };
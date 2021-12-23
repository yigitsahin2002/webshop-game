import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo
  } from 'react';

import * as platformApi from "../api/platforms";
import { useSession } from './AuthProvider';

  export const PlatformContext = createContext();
  export const usePlatforms = () => useContext(PlatformContext);

  export const PlatformProvider = ({
    children
  }) => {
    const [initialLoad, setInitialLoad] = useState(false);
    const [currentPlatform, setCurrentPlatform] = useState({});
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [platforms, setPlatforms] = useState([]);

    const { ready : authReady } = useSession();

    const refreshPlatforms = useCallback(async () => {
      try {
        setError('');
        setLoading(true);
        const data = await platformApi.getAllPlatforms();
        setPlatforms(data.data);
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
        refreshPlatforms();
        setInitialLoad(true);
      }
    }, [authReady, initialLoad, refreshPlatforms]);

    const createOrUpdatePlatform = useCallback(async ({
      id,
      naam_platform
    }) => {
      setError('');
      setLoading(true);
      try {
        await platformApi.savePlatform({id, naam_platform});
        await refreshPlatforms();
        return true;
      } catch (error) {
        setError(error)
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshPlatforms]);

    const deletePlatform = useCallback(async (id) => {
      setLoading(true);
      setError('');
      try {
        await platformApi.deletePlatform(id);
        await refreshPlatforms();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshPlatforms]);

    const setPlatformToUpdate = useCallback(
      (id) => {
        setCurrentPlatform(
          id === null ? {} : platforms.find((p) => p.id === id)
        );
      },
      [platforms]
    );

    const value = useMemo(() => ({
      currentPlatform,
      setCurrentPlatform,
      platforms,
      error,
      setError,
      loading,
      deletePlatform,
      createOrUpdatePlatform,
      setPlatformToUpdate
    }), [platforms, error, setError, loading, setCurrentPlatform, deletePlatform, currentPlatform, createOrUpdatePlatform, setPlatformToUpdate])

    return (
      <PlatformContext.Provider value={value}>
        {children}
      </PlatformContext.Provider>
    );
  };
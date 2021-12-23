import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo
  } from 'react';

import * as publisherApi from "../api/publishers";
import { useSession } from './AuthProvider';

  export const PublisherContext = createContext();
  export const usePublishers = () => useContext(PublisherContext);

  export const PublisherProvider = ({
    children
  }) => {
    const [initialLoad, setInitialLoad] = useState(false);
    const [currentPublisher, setCurrentPublisher] = useState({});
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [publishers, setPublishers] = useState([]);

    const { ready : authReady } = useSession();

    const refreshPublishers = useCallback(async () => {
      try {
        setError('');
        setLoading(true);
        const data = await publisherApi.getAllPublishers();
        setPublishers(data.data);
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
        refreshPublishers();
        setInitialLoad(true);
      }
    }, [authReady, initialLoad, refreshPublishers]);

    const createOrUpdatePublisher = useCallback(async ({
      id,
      naam_publisher
    }) => {
      setError('');
      setLoading(true);
      try {
        await publisherApi.savePublisher({id, naam_publisher});
        await refreshPublishers();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshPublishers]);

    const deletePublisher = useCallback(async (id) => {
      setLoading(true);
      setError();
      try {
        await publisherApi.deletePublisher(id);
        await refreshPublishers();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshPublishers]);

    const setPublisherToUpdate = useCallback(
      (id) => {
        setCurrentPublisher(
          id === null ? {} : publishers.find((p) => p.id === id)
        );
      },
      [publishers]
    );

    const value = useMemo(() => ({
      currentPublisher,
      setCurrentPublisher,
      publishers,
      error,
      setError,
      loading,
      deletePublisher,
      createOrUpdatePublisher,
      setPublisherToUpdate
    }), [publishers, error, setError, loading, setCurrentPublisher, deletePublisher, currentPublisher, createOrUpdatePublisher, setPublisherToUpdate])

    return (
      <PublisherContext.Provider value={value}>
        {children}
      </PublisherContext.Provider>
    );
  };
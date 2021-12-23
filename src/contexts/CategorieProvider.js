import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo
  } from 'react';
import { useSession } from './AuthProvider';

import * as categorieApi from "../api/categorieen";

  export const CategorieContext = createContext();
  export const useCategorieen = () => useContext(CategorieContext);

  export const CategorieProvider = ({
    children
  }) => {
    const [initialLoad, setInitialLoad] = useState(false);
    const [currentCategorie, setCurrentCategorie] = useState({});
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [categorieen, setCategorieen] = useState([]);

    const { ready : authReady } = useSession();

    const refreshCategorieen = useCallback(async () => {
      try {
        setError('');
        setLoading(true);
        const data = await categorieApi.getAllCategorieen();
        setCategorieen(data.data);
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
        refreshCategorieen();
        setInitialLoad(true);
      }
    }, [authReady, initialLoad, refreshCategorieen]);

    const createOrUpdateCategorie = useCallback(async ({
      id,
      naam_categorie
    }) => {
      try {
        setError('');
        setLoading(true);
        await categorieApi.saveCategorie({id, naam_categorie});
        await refreshCategorieen();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshCategorieen]);

    const deleteCategorie = useCallback(async (id) => {
      setLoading(true);
      setError('');
      try {
        await categorieApi.deleteCategorie(id);
        refreshCategorieen();
        return true;
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, [refreshCategorieen]);

    const setCategorieToUpdate = useCallback(
      (id) => {
        setCurrentCategorie(
          id === null ? {} : categorieen.find((t) => t.id === id)
        );
      },
      [categorieen]
    );

    const value = useMemo(() => ({
      currentCategorie,
      setCurrentCategorie,
      categorieen,
      error,
      setError,
      loading,
      deleteCategorie,
      createOrUpdateCategorie,
      setCategorieToUpdate
    }), [categorieen, error, setError, loading, setCurrentCategorie, deleteCategorie, currentCategorie, createOrUpdateCategorie, setCategorieToUpdate])

    return (
      <CategorieContext.Provider value={value}>
        {children}
      </CategorieContext.Provider>
    );
  };
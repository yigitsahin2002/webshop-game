import {
    createContext,
    useState,
    useCallback,
    useContext,
    useMemo
  } from 'react';
import * as usersApi from "../api/users";

  export const UsersContext = createContext();
  export const useUsers = () => useContext(UsersContext);

  export const UsersProvider = ({
    children
  }) => {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const refreshUsers = useCallback(async () => {
      try {
        setError('');
        setLoading(true);
        const data = await usersApi.getAllUsers();
        setUsers(data.data);
        return true
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }

    }, []);

    const updateUser = useCallback(async ({
      id,
      user_naam,
      user_achternaam,
      user_email,
    }) => {
      try {
        setError('');
        setLoading(true);
        await usersApi.saveUser({
            id,
            user_naam,
            user_achternaam,
            user_email,
        });
        return true;
      } catch (error) {
        setError(error)
        return false;
      } finally {
        setLoading(false)
      }
    }, []);

    const deleteUser = useCallback(async (id) => {
      setLoading(true);
      setError();
      try {
        await usersApi.deleteUser(id);
        return true
      } catch (error) {
        setError(error);
        return false;
      } finally {
        setLoading(false)
      }
    }, []);


    const value = useMemo(() => ({
      users,
      error,
      setError,
      loading,
      refreshUsers,
      deleteUser,
      updateUser,
    }), [users, error, setError, loading, refreshUsers, deleteUser, updateUser])

    return (
      <UsersContext.Provider value={value}>
        {children}
      </UsersContext.Provider>
    );
  };
import { useCallback, useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { createContext } from "react";

import * as usersApi from "../api/users";
import config from "../config.json";
import * as api from "../api";

const JWT_TOKEN_KEY = config.token_key;
const AuthContext = createContext();

function parseJWT(token) {
    if (!token) return {};
    const base64url = token.split(".")[1];
    const payload = Buffer.from(base64url, 'base64'); // base64 handelt base64url automatisch af
    const jsonPayload = payload.toString('ascii');

    return JSON.parse(jsonPayload);
}

function parseExp(exp) {
    if (!exp) return null;
    if (typeof exp !== 'number') exp = Number(exp);
    if (isNaN(exp)) return null;
    return new Date(exp * 1000);
}

const useAuth = () => useContext(AuthContext);

export const useSession = () => {
    const { loading, error, setError, token, user, ready, hasRole, setSession } = useAuth();

    return { loading, error, setError, token, user, ready , isAuthed : Boolean(token), hasRole, setSession};
}

export const useLogin = () => {
    const {login} = useAuth();
    return login;
}

export const useLogout = () => {
    const {logout} = useAuth();
    return logout;
}

export const useRegister = () => {
    const {register} = useAuth();
    return register;
}


export const AuthProvider = ({
    children
}) => {
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
    const [user, setUser] = useState(null);

    const setSession = useCallback(async (token, user) => {
        const { exp, userID } = parseJWT(token);
        const expiry = parseExp(exp);
        const stillValid = expiry >= new Date();

        if (stillValid) {
            localStorage.setItem(JWT_TOKEN_KEY, token);
        } else {
            setError('Session expired, please sign in again');
            localStorage.removeItem(JWT_TOKEN_KEY);
            token = null;
        }
        api.setAuthToken(token);
        setReady(stillValid);
        setToken(token);

        if (!user && stillValid) {
            user = await usersApi.getById(userID);
        }
        setUser(user);
    }, [])

    useEffect(() => {
        setSession(token, null);
    }, [token, setSession])

    const login = useCallback( async (email, password) => {
        try {
            setLoading(true);
            setError("");
            const {token, user} = await usersApi.login(email, password);
            setSession(token, user);
            return true;
        } catch (error) {
            setError(error);
            return false;
        } finally {
            setLoading(false);
        }
    }, [setSession])

    const register = useCallback(async ({naam, achternaam, email, password}) => {
        try {
            setLoading(true);
            setError('');
            const { token, user } = await usersApi.register({naam, achternaam, email, password});
            setSession(token, user);
            return true;
        } catch (error) {
            setError(error)
            return false;
        } finally {
            setLoading(false);
        }
    }, [setSession]);

    const logout = useCallback(() => {
        setSession(null, null);
    }, [setSession])

    const hasRole = useCallback((role) => {
        if (!user) return false;
        const { roles } = parseJWT(token);
        return roles.includes(role);
    }, [user, token]);

    const value = useMemo(() => ({
        loading,
        error,
        setError,
        token,
        user,
        ready,
        setSession,
        login,
        logout,
        register,
        hasRole
    }), [loading, error, setError, token, user, ready, setSession, login, register, logout, hasRole]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};
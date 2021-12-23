import { useMemo } from "react";
import { Route, Redirect, useLocation} from "react-router-dom";
import { useSession } from "../contexts/AuthProvider";

export default function PrivateRoute({ children, role, ...rest }) {
    const { isAuthed, hasRole } = useSession();
    const { pathname } = useLocation();

    const canShowRoute = useMemo(() => {
        if (!role) return isAuthed;
        return isAuthed && hasRole(role);
    }, [role, isAuthed, hasRole])
    return (
        <Route {...rest}>
            {
                canShowRoute ? (
                    children
                ) : (
                    <Redirect from={pathname} to="/webshop-game/login" />
                )
            }
        </Route>
    )
}
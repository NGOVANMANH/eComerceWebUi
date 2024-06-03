// AuthContext.js
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);


    useEffect(() => {
        if (localStorage.getItem('user')) {
            const user = JSON.parse(localStorage.getItem('user'));
            setUser(user);
            setIsAuthenticated(true);
        }
        else {
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [])

    const login = (user) => {
        setIsAuthenticated(true);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        if (user.role === 'admin') {
            window.location.href = '/admin'
        }
        else {
            window.location.href = '/'
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/'
    };

    const updateUser = (user) => {
        setUser(user)
    }

    return <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
        {children}
    </AuthContext.Provider>
};

export default AuthContext;

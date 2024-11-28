import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, setToken] = useState(null);
    const [loginStatus, setLoginStatus] = useState();
    
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem("jwt",userToken);
        checkLogin();
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("jwt");
        setLoginStatus(false);
    };
    const checkLogin = async() => {
        const localToken = localStorage.getItem("jwt");
        if(localToken){
            try{
                const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/auth/current`,{
                    headers:{
                        Authorization: localToken
                    }
                });
                if(res.statusText=="OK"){
                    setUser(res.data.user);
                    setToken(localToken);
                    setLoginStatus(true);
                    // console.log(res.data.user);
                } else {
                    setLoginStatus(false);
                }
            } catch(err){
                // console.log(err,"error check token")
            }
        }
    }
    useEffect(()=>{
        checkLogin();
    },[]);
    return (
        <UserContext.Provider value={{ user, token, loginStatus, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
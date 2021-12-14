import { createContext, useEffect, useReducer } from 'react';
import AuthReducer from './AuthReducer';
const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFeching: false,
    error: false

};
// {
//     _id: "61a130f79eab97e8766e8c0e",
//     username: "mohamed",
//     email: "med@gmail.com",
//     password: "$2b$10$FpO8NlV4yLh4iAvFgoUjXeXp4G4yz.TOJjd0NyYvspzrbYqlM4Nk2",
//     profilePicture: "persons/p7.png",
//     coverPicture: "",
//     isAdmin: false,
//     followers: [],
//     followings: [],
//     desc: "hello i' using AwesomeApp",
//     city: "errisany",
//     from: "morocco",
//     relationship: "1"
// },
export const AuthContext = createContext(INITIAL_STATE);
// local storage 

// create the wrapper 
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    useEffect(() => {
        localStorage.setItem("user",JSON.stringify(state.user));
    }, [state.user])
    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFeching: state.isFeching,
                error: state.error,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>


    )
}
//1) dispatch action
//2) reducer
//
//3) update state


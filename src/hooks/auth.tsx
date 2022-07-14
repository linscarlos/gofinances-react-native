import React, { createContext, ReactNode, useContext } from "react";

import * as AuthSession from 'expo-auth-session';

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps){

    const user = {
        id: '1234567',
        name: 'Carlos Lins',
        email: 'carloslinsdev@gmail.com'
    }

    async function signInWithGoogle() {
        try {
            const CLIENT_ID = '380365111624-klht61c9d5fhufei302vcd4jncmbvorf.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@carloslinsdev/gofinances';
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession
            .startAsync({ authUrl }) as AuthorizationResponse;

            if(type === 'sucess'){
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();
                console.log(response)
            }
        } catch (error) {
            throw new Error(error as string);
        }
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            signInWithGoogle 
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext);

    return context
}

export { AuthProvider, useAuth }


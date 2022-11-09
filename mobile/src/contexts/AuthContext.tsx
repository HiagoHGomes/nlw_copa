import { createContext, ReactNode, useState, useEffect } from "react";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {api} from '../services/api'

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps{
    user: UserProps;
    signIn : () => Promise<void>;
    isUserLoading: boolean;

}

interface AutoProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({children}:AutoProviderProps) {
    const [user, setUser] = useState<UserProps>({} as UserProps)

    const [isUserLoading, setisUserLoading] = useState(false)

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({useProxy:true}),
        scopes: ['profile', 'email']
    })


    async function signIn() {
        try {
            setisUserLoading(true);
            await promptAsync();
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setisUserLoading(false);
        }
    }

    async function signInWithGoogle(access_token: string) {
        
        try {
            setisUserLoading(true);
            const tokenResponse = await api.post('/users', {access_token});
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`; 
            
            const userInfoResponse = await api.get('/me');
            setUser(userInfoResponse.data.user);

        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            setisUserLoading(false);
        }
    }

    useEffect(()=>{
        if(response?.type==='success' && response.authentication?.accessToken){
            signInWithGoogle(response.authentication.accessToken)
        }
    },[response]);

    return(
        
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,
            }}>
            {children}
        </AuthContext.Provider>
    )
} 
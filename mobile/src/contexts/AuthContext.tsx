import { createContext, ReactNode, useState, useEffect } from "react";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps{
    user: UserProps,
    isUserLoading: boolean,
    signIn : () => Promise<void>;

}

interface AutoProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({children}:AutoProviderProps) {
    const [user, setUser] = useState<UserProps>({} as UserProps)

    const [isUserLoading, setisUserLoading] = useState(false)

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '586007225916-gqkm8jqerg5p5r0ae7hul0i4aa818hp0.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({useProxy:true}),
        scopes: ['profile', 'email']
    })


    async function signIn() {
        try {
            setisUserLoading(true);
            await promptAsync();
        } catch (error) {
            throw error;
        } finally {
            setisUserLoading(false);
        }
    }

    async function signInWithGoogle(access_token: string) {
        console.log('TOken', access_token)
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

import * as SecureStore from "expo-secure-store";
import { create } from 'zustand';
import { TokenCache } from "@clerk/clerk-expo/dist/cache";
import { Platform } from "react-native";

type JwtStore = {
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
  expired: boolean;
  setExpired: (expired: boolean) => void;
};

export const useJwtStore = create<JwtStore>()(
  (set) => ({
    jwt: null,
    setJwt: (jwt) => set({ jwt, expired: false }),
    expired: false,
    setExpired: (expired) => set({ expired, jwt: null }),
  }),
);

 
const createTokenCache = (): TokenCache => {
    return {
        getToken: (key) => {
            return SecureStore.getItemAsync(key);
        },
        saveToken: (key, token) => {
            return SecureStore.setItemAsync(key, token);
        },
    };
};

// SecureStore is not supported on the web
// https://github.com/expo/expo/issues/7744#issuecomment-611093485
export const tokenCache = Platform.OS !== "web" ? createTokenCache() : undefined;
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type JwtStore = {
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
  expired: boolean;
  setExpired: (expired: boolean) => void;
};

export const useJwtStore = create<JwtStore>()(
  devtools((set) => ({
    jwt: null,
    setJwt: (jwt) => set({ jwt, expired: false }),
    expired: false,
    setExpired: (expired) => set({ expired, jwt: null }),
  })),
);

type UrlStore = {
  url: Array<string>;
  setUrl: (url: Array<string>) => void;
};

export const useUrlStore = create<UrlStore>()(
  devtools((set) => ({
    url: ['/'],
    setUrl: (url) => set({ url }),
  })),
);

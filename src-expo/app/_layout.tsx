import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, useColorScheme, Text, StyleSheet} from 'react-native';
import { tokenCache, useJwtStore } from '../utils/store'
import { rspc, queryClient, client} from '../utils/rspc'
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import React from 'react';
import SignInScreen from '../components/SignInScreen';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const clerkKey = 'pk_test_c2ltcGxlLXJhdmVuLTg1LmNsZXJrLmFjY291bnRzLmRldiQ' 

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <rspc.Provider client={client} queryClient={queryClient}>
      <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
        <RootLayoutNav />
      </ClerkProvider>
    </rspc.Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const { getToken, isSignedIn, userId} = useAuth();

  const setToken = useJwtStore((s) => s.setJwt);
  const isExpired = useJwtStore((s) => s.expired);

  React.useEffect(() => {
    if (isSignedIn && !isExpired) return;
    const token = async () => {
      return await getToken({ template: 'with_role' });
    };
    token().then((res) => setToken(res));
  }, [isSignedIn, isExpired]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SignedIn>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
      </SignedIn>
        <SignedOut>
          <SignInScreen/>
        </SignedOut>
    </ThemeProvider>
  );
}



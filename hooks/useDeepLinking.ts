import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { supabase } from 'api/supabase';

export function useDeepLinking() {
  useEffect(() => {
    // Handle initial URL if app was opened from a deep link
    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        handleDeepLink(url);
      }
    };

    handleInitialURL();

    // Listen for deep links while app is open
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = async (url: string) => {
    // Parse the URL
    const parsedUrl = Linking.parse(url);
    
    // Check if this is an auth callback
    if (parsedUrl.path === 'auth' && parsedUrl.queryParams) {
      const { access_token, refresh_token } = parsedUrl.queryParams;
      
      if (access_token && refresh_token) {
        try {
          // Set the session with the tokens from the magic link
          const { error } = await supabase.auth.setSession({
            access_token: access_token as string,
            refresh_token: refresh_token as string,
          });
          
          if (error) {
            console.error('Error setting session:', error);
          }
        } catch (error) {
          console.error('Error handling deep link:', error);
        }
      }
    }
  };
}
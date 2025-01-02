import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { AuthScreen } from "./screens/AuthScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { supabase } from '../services/supabase';

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BaseNavigationContainer>
      <StackNavigator.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Auth"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationEnabled: true
        }}
      >
        <StackNavigator.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            gestureEnabled: false
          }}
        />
        <StackNavigator.Screen
          name="Home"
          component={HomeScreen}
        />
      </StackNavigator.Navigator>
    </BaseNavigationContainer>
  );
};
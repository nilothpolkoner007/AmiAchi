import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { AuthScreen } from "./screens/AuthScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { QRConnectScreen } from "./screens/QRConnectScreen";
import { supabase } from '../services/supabase';

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [hasPartner, setHasPartner] = React.useState(false);

  React.useEffect(() => {
    checkAuthAndPartner();
  }, []);

  async function checkAuthAndPartner() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setIsAuthenticated(true);
      
      // Check if user has a partner
      const { data } = await supabase
        .from('couples')
        .select('*')
        .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`)
        .single();
      
      setHasPartner(!!data);
    }
  }

  return (
    <BaseNavigationContainer>
      <StackNavigator.Navigator
        initialRouteName={!isAuthenticated ? "Auth" : !hasPartner ? "QRConnect" : "Home"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animationEnabled: true
        }}
      >
        <StackNavigator.Screen
          name="Auth"
          component={AuthScreen}
          options={{ gestureEnabled: false }}
        />
        <StackNavigator.Screen
          name="QRConnect"
          component={QRConnectScreen}
          options={{ gestureEnabled: false }}
        />
        <StackNavigator.Screen
          name="Home"
          component={HomeScreen}
        />
      </StackNavigator.Navigator>
    </BaseNavigationContainer>
  );
};
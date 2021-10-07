/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {ColorSchemeName, Pressable, StyleSheet} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import NewCallScreen from '../screens/NewCallScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import CallsScreen from "../screens/CallsScreen";
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={NewCallScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const iconSize = 30;

  return (
    <BottomTab.Navigator
      initialRouteName="Calls"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="Calls"
        component={CallsScreen}
        options={({ navigation }: RootTabScreenProps<'Calls'>) => ({
          title: 'Calls',
          tabBarIcon: (props) => <TabBarIcon name="phone" {...props} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <Feather
                name="plus"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotFoundScreen}
        options={{
          title: 'Notifications',
          tabBarIcon: (props) => <TabBarIcon name="bell" {...props} />,
        }}
      />
      <BottomTab.Screen
        name="History"
        component={NotFoundScreen}
        options={{
          title: 'History',
          tabBarIcon: (props) => <TabBarIcon name="clock" {...props} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={NotFoundScreen}
        options={{
          title: 'Settings',
          tabBarIcon: (props) => <TabBarIcon name="tool" {...props} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
  size: number;
}) {
  return <Feather style={{ marginBottom: -3 }} {...props} />;
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3
  }
});

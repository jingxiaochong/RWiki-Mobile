import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from './src/utils/types';
import Home from './src/pages/home';
import Music from './src/pages/music';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const tabBarBackgroundColor = '#b4a1ce';
const tabBarActiveTintColor = '#8583bf';
const tabBarInactiveTintColor = '#ffffff';

const headerBackgroundColor = '#b4a1ce';
const headerTintColor = '#ffffff';

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="首页"
      component={Home}
      options={{
        tabBarLabel: '首页',
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
        tabBarActiveTintColor: tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        tabBarStyle: { backgroundColor: tabBarBackgroundColor },
        headerStyle: { backgroundColor: headerBackgroundColor },
        headerTintColor: headerTintColor,
      }}
    />
    <Tab.Screen
      name="音乐"
      component={Music}
      options={{
        tabBarLabel: '音乐',
        tabBarIcon: ({ color, size }) => (
          <Icon name="musical-notes" color={color} size={size} />
        ),
        tabBarActiveTintColor: tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        tabBarStyle: { backgroundColor: tabBarBackgroundColor },
        headerStyle: { backgroundColor: headerBackgroundColor },
        headerTintColor: headerTintColor,
      }}
    />
  </Tab.Navigator>
);

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TabNavigator"
          screenOptions={{
            headerStyle: { backgroundColor: headerBackgroundColor },
            headerTintColor: headerTintColor,
          }}
        >
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;

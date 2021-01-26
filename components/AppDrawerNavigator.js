import React from 'react';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from 'react-navigation-drawer';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import Dashboard from '../screens/Dashboard';
import InformationScreen from '../screens/InformationScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: Dashboard,
    navigationOptions: {drawerIcon: ({tintColor})=><MaterialIcons name="dashboard" size={20} color={tintColor} />}
  },
  Information: {
    screen: InformationScreen,
    navigationOptions: {drawerIcon: ({tintColor})=><FontAwesome5 name="database" size={20} color={tintColor} />, drawerLabel: 'Records'}

  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {drawerIcon: ({tintColor})=><MaterialIcons name="settings" size={20} color={tintColor} />}
  },
},
{contentComponent: CustomSideBarMenu},
{initialRouteName: 'Dashboard'},
)
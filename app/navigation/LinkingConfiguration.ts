/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Calls: {
            screens: {
              CallsScreen: 'calls',
            },
          },
          Notifications: {
            screens: {
              NotificationsScreen: 'notifications',
            },
          },
          History: {
            screens: {
              HistoryScreen: 'history',
            },
          },
          Settings: {
            screens: {
              SettingsScreen: 'settings',
            },
          },
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Screens/Home/Home';
import Notes from '../Screens/Notes/Notes';
import Assignment from '../Screens/Assignment/Assignment';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './DrawerNavigation';
import FeedBack from '../Screens/FeedBack/FeedBack';
import Downloads from '../Screens/Downloads/Downloads';
import PDFMerge from '../Screens/PDFMerge/PDFMerge';
import Scanner from '../Screens/Scanner/Scanner';
import FiltersOptionComponent from '../Screens/Scanner/FiltersOptionComponent';
import ApplyingFiltersComponent from '../Screens/Scanner/ApplyingFiltersComponent';


const Stack = createNativeStackNavigator();

export default class StackNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Drawer' component={DrawerNavigation} options={{ headerShown: false }}
          />
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }}
          />
          <Stack.Screen name='Notes' component={Notes} options={{ headerShown: false }}
          />
          <Stack.Screen name='Scanner' component={Scanner} options={{ headerShown: false }}
          />
          <Stack.Screen name='FilterSelectOption' component={FiltersOptionComponent} options={{ headerShown: false }}
          />
          <Stack.Screen name='ApplyFilters' component={ApplyingFiltersComponent} options={{ headerShown: false }}
          />
          <Stack.Screen name='Downloads' component={Downloads} options={{ headerShown: false }}
          />
          <Stack.Screen name='PDFMerge' component={PDFMerge} options={{ headerShown: false }}
          />
          <Stack.Screen name='Assignments' component={Assignment} options={{ headerShown: false }}
          />
          <Stack.Screen name='FeedBack' component={FeedBack} options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

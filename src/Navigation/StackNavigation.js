import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Screens/Home/Home';
import Notes from '../Screens/Notes/Notes';
import Presentation from '../Screens/Presentation/Presentation';
import Assignment from '../Screens/Assignment/Assignment';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './DrawerNavigation';
import FeedBack from '../Screens/FeedBack/FeedBack';
import SplashScreen from '../Screens/SplashScreen/SplashScreen';
import Downloads from '../Screens/Downloads/Downloads';


const Stack = createNativeStackNavigator();

export default class StackNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSplash: true, // show splash screen
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showSplash: false });
    }, 1800);
  }


  render() {
    return (
      (
        this.state.showSplash ? <SplashScreen /> : (
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name='Drawer' component={DrawerNavigation} options={{ headerShown: false }}
              />
              <Stack.Screen name='Home' component={Home} options={{ headerShown: false }}
              />
              <Stack.Screen name='Notes' component={Notes} options={{ headerShown: false }}
              />
              <Stack.Screen name='Presentations' component={Presentation} options={{ headerShown: false }}
              />
              <Stack.Screen name='Downloads' component={Downloads} options={{ headerShown: false }}
              />
              <Stack.Screen name='Assignments' component={Assignment} options={{ headerShown: false }}
              />
              <Stack.Screen name='FeedBack' component={FeedBack} options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        )
      )
    );
  }
}

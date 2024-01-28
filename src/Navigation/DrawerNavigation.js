import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../Screens/Home/Home';
import FeedBack from '../Screens/FeedBack/FeedBack';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
  <Drawer.Navigator screenOptions={{
    headerShown: false,
    drawerStyle: {
        backgroundColor: 'white',
        width: 240,
        color:"black",
        fontWeight:'bold',
        fontSize:30
    },
}}>
        <Drawer.Screen name='Home' component={Home}/>
        <Drawer.Screen name='FeedBack' component={FeedBack}/>
    </Drawer.Navigator>
  );
}
export default DrawerNavigation;
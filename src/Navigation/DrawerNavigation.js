import { 
  createDrawerNavigator, 
  DrawerContentScrollView, 
  DrawerItemList 
} from '@react-navigation/drawer';
import Home from '../Screens/Home/Home';
import FeedBack from '../Screens/FeedBack/FeedBack';
import { View, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions } from 'react-native';


const Drawer = createDrawerNavigator();
const { height } = Dimensions.get('window');


const DrawerTopIconView = (props) => {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: '#deb018' }}>
    <View style={{ height: 76, backgroundColor: '#deb018', justifyContent: 'center', alignItems: 'center' }} >
      <Image
        source={require('../assets/Images/logo-black.png')}
        style={{ width: 50, height: 50, borderRadius: 50 }}
      />
      </View>
      <View style={{ height: height, backgroundColor: '#fff' }}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}
function DrawerNavigation() {
  return (
    <Drawer.Navigator
    drawerContent={props => <DrawerTopIconView {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'white',
          width: 200,
          color: "black",
          fontWeight: 'bold',
          fontSize: 40,
        },
      }}>
      <Drawer.Screen name='Home' component={Home} />
      <Drawer.Screen name='FeedBack' component={FeedBack} />

    </Drawer.Navigator>
  );
}
export default DrawerNavigation;
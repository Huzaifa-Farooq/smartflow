import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";


const pathMap = {
    'fileDownload': require('../assets/animations/upload.json'),
    'download': require('../assets/animations/upload.json'),
    'upload': require('../assets/animations/upload.json'),
    'fileUpload': require('../assets/animations/upload.json'),
    'fileSearch': require('../assets/animations/fileSearch.json'),
    'writeOnPage': require('../assets/animations/writeOnPage.json'), 
    'splashScreen': require('../assets/animations/splashScreen.json'),
    'wait': require('../assets/animations/wait.json'),
    // 'loading': require('../assets/animations/loading.json'),
    'success': require('../assets/animations/success.json'),
    'presentation': require('../assets/animations/presentation.json'),
};


const AnimatedIcon = ({ name, style, loop=true, props }) => {
    if (name == 'download' || name == 'fileDownload'){
        style = {
            ...style,
            ...stylesheet.rotate
        };
    }

    return (
        <LottieView 
            source={pathMap[name]}
            autoPlay
            loop={loop}
            style={{
                ...style
            }}
            {...props}

        >
            </LottieView>
    );
}


const stylesheet = StyleSheet.create({
    rotate: {
        transform: [{ rotate: '180deg' }]
    }
})

export default AnimatedIcon;

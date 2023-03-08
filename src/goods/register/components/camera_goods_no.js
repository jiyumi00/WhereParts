import React, { Component } from 'react';
import { View, LogBox} from 'react-native';

import CameraX from '../../../util/camera_x';

import { styles } from "../../../styles/register/visioncamera_style";

// 오류구문 무시
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default class PartsNoCamera extends Component {
    constructor(props) {
        super(props);

        this.cutImageStyle={
            position:'absolute',
            top:'30%', 
            left:'15%',
            right:'15%',
            bottom:'58%', 
            zIndex:2, 
            borderColor:'white',
        };

        this.viewStyle={
            textView:{color:'white', zIndex:11, top:"25%", left:"33%", postion:'absolute'},
            topBlur:{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "100%", height: "30%", position: 'absolute' },
            leftBlur:{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "15%", height: "12%", top: "30%", position: 'absolute'},
            rightBlur:{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "15%", height: "12%", top: "30%", left: '85%', position: 'absolute' },
            bottomBlur:{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "100%", height: "58%", top: "42%", position: 'absolute'},
            imageLeftTop:{zIndex: 11, height: 30, width: 30, top: "26%", left: "14%", postion: 'absolute'},
            imageRightTop:{zIndex: 11, height: 30, width: 30, top: "21%", left: "79%", postion: 'absolute'},
            imageLeftBottom:{zIndex: 11, height: 30, width: 30, top: "25%", left: "14%", postion: 'absolute'},
            imageRightBottom:{zIndex: 11, height: 30, width: 30, top: "20%", left: "79%", postion: 'absolute'},
            cameraButtonView:{height:"25%",top:"110%",}
        }
    }

    onCapturedListener=(uri)=> {
        console.log('original image : ',uri);
    }

    onCutImageListener=(uri) => {
        console.log('cut image : ',uri);
        console.log(this.props);
        this.props.route.params.onResultListener(uri);
    }

    render() {
        return(
            <View style={styles.background_view}>
                <CameraX autoClose={true} navigation={this.props.navigation} cutImageStyle={this.cutImageStyle} viewStyle={this.viewStyle} onCapturedListener={this.onCapturedListener} onCutImageListener={this.onCutImageListener} />
            </View>
        );
    }
}
import React, { Component } from 'react';
import {View} from 'react-native';

import { styles } from "../styles/vision_camera_style";
import CameraX from '../util/camera_x';


export default class BusinessCardCamera extends Component {
    constructor(props) {
        super(props);

        this.cutImageStyle={
            position:'absolute',
            top:'20%', 
            left:'10%',
            right:'10%',
            bottom:'40%',
            zIndex:2, 
            borderWidth:1, 
            borderColor:'white'
        };

        this.viewStyle={
            textView:{color:'white', zIndex:11, top:"15%", left:"33%", postion:'absolute'},
            topBlur:{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "100%", height: "20%", position: 'absolute' },
            leftBlur:{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "10%", height: "40%", top: "20%", position: 'absolute'},
            rightBlur:{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "10%", height: "40%", top: "20%", left: '90%', position: 'absolute' },
            bottomBlur:{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "100%", height: "58%", top: "60%", position: 'absolute'},
            imageLeftTop:{zIndex: 11, height: 30, width: 30, top: "16%", left: "9%", postion: 'absolute'},
            imageRightTop:{zIndex: 11, height: 30, width: 30, top: "11%", left: "84%", postion: 'absolute'},
            imageLeftBottom:{zIndex: 11, height: 30, width: 30, top: "44%", left: "9%", postion: 'absolute'},
            imageRightBottom:{zIndex: 11, height: 30, width: 30, top: "39%", left: "84%", postion: 'absolute'},
            cameraButtonView:{height:"30%",top:"126%"}
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
            <View style={styles.container}>
                <CameraX autoClose={true} navigation={this.props.navigation} cutImageStyle={this.cutImageStyle} viewStyle={this.viewStyle} onCapturedListener={this.onCapturedListener} onCutImageListener={this.onCutImageListener} />
            </View>
        );
    }
}
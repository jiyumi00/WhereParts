import React, { Component } from 'react';
import { View,Dimensions } from 'react-native';

import { styles } from "../styles/vision_camera_style";
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
import CameraX from '../util/camera_x';
import WebServiceManager from "../util/webservice_manager";
import Constant from "../util/constatnt_variables";

export default class CompanyCamera extends Component {
    constructor(props) {
        super(props);

        this.cutImageStyle={
            top:'6%', 
            left:'10%',
            right:'10%',
            bottom:'27%',
            position:'absolute',
            zIndex:2, 
            //borderWidth:1, 
            borderColor:'white',
        };

        this.viewStyle={
            textView:{color:'white', zIndex:11, top:"2%", left:"33%", postion:'absolute'},
            topBlur:{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "100%", height: "6%", position: 'absolute' },
            leftBlur:{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "10%", height: "67%", top: "6%", position: 'absolute'},
            rightBlur:{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "10%", height: "67%", top: "6%", left: '90%', position: 'absolute' },
            bottomBlur:{backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, width: "100%", height: "58%", top: "73%", position: 'absolute'},
            imageLeftTop:{zIndex: 11, height: 30, width: 30, top: "2%", left: "9%", postion: 'absolute'},
            imageRightTop:{zIndex: 11, height: 30, width: 30, top: "-3%", left: "84%",right:0, postion: 'absolute'},
            imageLeftBottom:{zIndex: 11, height: 30, width: 30, top: "57%", left: "9%", postion: 'absolute'},
            imageRightBottom:{zIndex: 11, height: 30, width: 30, top: "52%", left: "84%", postion: 'absolute'},
            cameraButtonView:{height:"20%",top:ScreenHeight-(ScreenHeight/3.5),bottom:0}
        }
    }

    async callCompanyNoAPI(imageData) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetCompanyNo", "post");
        manager.addBinaryData("file", imageData);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    onCutImageListener=(uri) => {
        console.log('cut image : ',uri);
        console.log(this.props);

        const fileData = {
            uri: uri,
            type: "image/jpeg",
            name: 'photo.jpg',
        }

        this.callCompanyNoAPI(fileData).then((response) => {
            console.log("responseNo", response);
            if (response.success == 0)
                this.props.route.params.onResultListener("0", uri);
            else
                this.props.route.params.onResultListener(response.no, uri);
            //this.props.navigation.pop();
        })
    }

    onCapturedListener=(uri)=> {
        console.log('original image : ',uri);
    }

    render() {
        return(
            <View style={styles.container}>
                <CameraX autoClose={true} navigation={this.props.navigation} cutImageStyle={this.cutImageStyle} viewStyle={this.viewStyle} onCapturedListener={this.onCapturedListener} onCutImageListener={this.onCutImageListener} />
            </View>
        );
    }
}
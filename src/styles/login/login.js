import { StyleSheet } from 'react-native';
import { Dark_Gray, Light_Gray, Sub_Color } from '../../util/color';

export const styles = StyleSheet.create({
   
    total_container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        marginTop: 80,
        marginLeft: 30,
        marginRight: 30,
    },
    // View
        itemLayout_view: {
            flex: 2,
            marginBottom: 50
        },
        header_textLayout_view: {
            alignItems:'center',
        },
        textInput_view: {
            backgroundColor: 'white',
            marginBottom: 20,
            paddingHorizontal: 20,
            paddingVertical: 7,
            height: 70,
            borderRadius: 10,
            borderColor: Light_Gray,
            borderWidth: 2,
        },
        row_view : {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
    
    // Button
        // default
        default_btn:{
            height:50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        // login 활성화,비활성화
        disable_login_btn: {
            backgroundColor: Light_Gray,
        },
        enable_login_btn:{
            backgroundColor: Sub_Color,
        },

    // Text
        // default
        default_title_text:{
            fontFamily:"Cochin" ,
            fontWeight:"bold",
            fontSize: 40,
            color: "black",
        },
        default_text:{
            fontFamily:"Cochin" ,
            fontSize: 13,
            color: "black",
        },
        // title
        where_title_text: {
            marginBottom: -15,
        },
        parts_title_text: {
            color: Sub_Color,
            marginBottom: 80,
        },
        // 일반
        login_guide_text: {
            color: Dark_Gray,
            marginBottom:70,
        },
        pw_signup_text: {
            fontSize: 15,
            color: Dark_Gray,
            marginBottom: 15, 
        },
        login_btn_text: {
            fontSize: 18,
            color: "white",
        },
        // radio버튼
        radio_btn_text:{
            color:Dark_Gray,
            paddingTop:5,
        },
})
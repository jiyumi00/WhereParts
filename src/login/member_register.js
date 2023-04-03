import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert, ScrollView, PermissionsAndroid, Keyboard } from 'react-native';

import { styles } from "../styles/login/login";

import Constant from "../util/constatnt_variables";
import WebServiceManager from "../util/webservice_manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from 'react-native-splash-screen';
import IconRadio from 'react-native-vector-icons/MaterialIcons';

import messaging from '@react-native-firebase/messaging';

class Login extends Component {

    constructor(props) {
        super(props);
        this.idRef = React.createRef(); //다음을 눌렀을 경우 포커싱 이동을 위함
        this.passwordRef = React.createRef();
        this.loginButtonRef = React.createRef();
        this.deviceToken='';
        
        this.state = {
            companyNo: '', //사업자번호
            passwd: '', //비밀번호
            id: '', //userID
            validForm: false, //유효성 검사

            detailLogin: 0, //0->자동로그인X, 아이디기억 X, 1->자동로그인, 2->아이디 기억
            autoLoginChecked: false,
            rememberIdChecked: false
        }
    }

    //자동로그인
    componentDidMount() {
        SplashScreen.hide();

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

        //퍼미션 설정되었는지 확인
        this.requestPermission();
        //알림메시지 처리
        this.handleFCMMessage();
        //자동 로그인 처리되는지 확인
        this.availableLogin().then((response) => {
            if(response==true) {
                //this.setState({companyNo:companyNo,passwd:passwd,detailLogin:detailLogin});
                //this.autoLoginRadioButtonChecked();
                this.callLoginAPI(true).then((response) => {
                    console.log("자동 로그인 성공", response);
                    this.props.navigation.navigate('TabHome');
                });
            }
        });
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        //BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }

    keyboardDidShow = () => {
        console.log('Keyboard Shown');
    }

    keyboardDidHide = () => {
        console.log('Keyboard Hide');
        //this.onValueChange();
    }

    async requestPermission() {
        try {
            const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, 
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            ]).then((result) => {
                if (result['android.permission.CAMERA'] && 
                    result['android.permission.ACCESS_FINE_LOCATION'] && 
                    result['android.permission.READ_EXTERNAL_STORAGE'] && 
                    result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                    console.log('모든 권한 획득')
                }
                else {
                    console.log('거절된 권한있음')
                }
            });

            //push notification 퍼미션이 허용되어 있으면 토큰을 가져옴 (안드로이드 12까지는 알림이 무조건 허용되어 있음 13부터는 퍼미션 물어봄)
            const authStatus = await messaging().requestPermission();        
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
                    
            //알림 권한이 설정되어 있으면...
            if (enabled) {        
                const token = await messaging().getToken();
            //푸시 토큰 표시         
                console.log('fcm token:', token);            
                console.log('Authorization status:', authStatus);    
                this.deviceToken=token;        
            
            } else {        
                console.log('fcm auth fail');        
            }
        } catch(err) {
            console.warn(err);
        }
    }

    //로그인 정보가 앱에 저장되어 있다면...(자동로그인,id기억 관리)
    async availableLogin() {
        const obj = await AsyncStorage.getItem('obj');
        if(obj !== null) {
            const {companyNo,passwd,detailLogin} = JSON.parse(obj);  
            console.log(companyNo,passwd,detailLogin);        
            if (detailLogin == 0) {         //로그인 방법을 아무것도 선택하지 않았을 경우
                return false;
            }
            else if (detailLogin == 1) {    //자동 로그인일 경우
                this.setState({companyNo:companyNo,passwd:passwd,detailLogin:detailLogin});
                this.autoLoginCheckButtonChecked();
                return true;
            }
            else {                          //id 기억일 경우
                this.setState({ companyNo: companyNo, detailLogin:detailLogin });
                this.rememberIdCheckButtonChecked();
                return false;
            }
        }
        else {
            return false; //null 값일 경우 false (저장되어 있는 로그인 정보가 없다면)
        }
    }

    //입력값 유효성 검사
    onValueChange = (value) => {
        this.setState(value,()=>{
            let isValidForm = true;
            if (this.state.companyNo.trim().length < 10) { // 조건 필요시 추가
                isValidForm = false;
            }
            if (this.state.passwd.trim().length == 0) {
                isValidForm = false;
            }
    
            console.log("isValidForm", isValidForm);
            this.setState({ validForm: isValidForm });
        });
    }

    loginButtonClicked = () => { // 로그인 버튼 눌렀을 때 호출되는 함수
        //this.loginInfo.companyNo = this.state.companyNo;
        //this.loginInfo.passwd = this.state.passwd;
        
        this.callLoginAPI(false).then((response) => {
            if (response.id == "0") { //회원정보가 없을 경우 
                //this.passwordRef.clear();
                Alert.alert('아이디 비밀번호를 확인해주세요', '',);
                return false;
            }
            else {
                const obj = {
                    companyNo: this.state.companyNo, //사업자번호
                    id: response.id, //userId
                    passwd: this.state.passwd, //비밀번호
                    detailLogin: this.state.detailLogin
                }
                console.log("로그인 성공");
                AsyncStorage.setItem('obj', JSON.stringify(obj));
                console.log('storage=',obj);
                console.log(response);
                this.props.navigation.navigate('TabHome');
            }
        })
    }

    async callLoginAPI(autoLogined) { //사업자번호와 비밀번호를 서버로 보내주는 API
        const {companyNo,passwd} = this.state;
        let manager = new WebServiceManager(Constant.serviceURL + "/Login", "post");
        
        //자동 로그인으로 할 경우에는 deviceToken을 빈문자열로 넘겨준다(디바이스가 같은것이므로 굳이 token을 변경할 필요가 없다)
        if(autoLogined)
            manager.addFormData("data", {companyNo: companyNo, passwd: passwd,deviceToken:""});
        else
            manager.addFormData("data", {companyNo: companyNo, passwd: passwd,deviceToken:this.deviceToken});
            
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    async callSetReadNotiAPI(id) {
        let manager = new WebServiceManager(Constant.serviceURL +"/SetReadNoti?id="+id);
        let response = await manager.start();
        if(response.ok)
            return response.json();
    }

    registerUserButtonClicked = () => {
        this.props.navigation.navigate('SignUp'); //회원가입 버튼 눌렀을 경우
    }

    //아무것도 체크안한 상태 --0, 자동로그인 체크 --1, id기억 체크 --2
    autoLoginCheckButtonChecked = () => {
        if (this.state.autoLoginChecked == true) {
            this.setState({ autoLoginChecked: false, detailLogin: 0 });
        } 
        else if (this.state.rememberIdChecked == true) {
            this.setState({ autoLoginChecked: true, rememberIdChecked: false, detailLogin: 1 })
        }
        else {
            this.setState({ autoLoginChecked: true, detailLogin: 1 })
        }
        
    }

    rememberIdCheckButtonChecked = () => {
        if (this.state.rememberIdChecked == true) {
            this.setState({ rememberIdChecked: false, detailLogin: 0 }); //아무것도 체크안한 상태
        } 
        else if (this.state.autoLoginChecked == true) {
            this.setState({ rememberIdChecked: true, autoLoginChecked: false, detailLogin: 2 })
        }
        else {
            this.setState({ rememberIdChecked: true, detailLogin: 2 }) //id 기억 체크    
        }
    }


    //추가된부분
    notiOkButtonClicked=(message)=> {
        this.callSetReadNotiAPI(message.data.id).then((response)=> {
            console.log(response);
        })
        if(message.data.kind=="buy")
            this.props.navigation.navigate("BuyList");
        else if(message.data.kind=="sell") 
            //this.props.navigation.navigate("SalesList");
            this.props.navigation.navigate('SalesList', {saleState:2})

    }

    //알림이 올 경우 
    handleFCMMessage=()=> {
        //Foreground 상태에서 알림이 오면 Alert 창 보여줌
        const unsubscribe = messaging().onMessage(async remoteMessage => {             
            Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body, [
                { text: '취소', onPress: () => { } },
                { text: '확인', onPress: () => this.notiOkButtonClicked(remoteMessage)}],
                { cancelable: false });
            return false;
            console.log(JSON.stringify(remoteMessage));            
        });
              
        //Background 상태에서 알림창을 클릭한 경우 해당 페이지로 이동         
        messaging().onNotificationOpenedApp(remoteMessage => {        
            console.log('Notification caused app to open from background state:',remoteMessage.notification);
            this.notiOkButtonClicked(remoteMessage);
        });
    }

    render() {
        const isLogout = this.state.isLogout;
        return (
            <>
                <View style={styles.total_container}>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.itemLayout_view}>
                                <View style={styles.header_textLayout_view}>
                                    <Text style={[styles.default_title_text, styles.where_title_text]}>WHERE</Text>
                                    <Text style={[styles.default_title_text, styles.parts_title_text]}>PARTS</Text>
                                </View>
                                <View style={styles.textInput_view}>
                                    <Text>사업자번호</Text>
                                    <TextInput
                                        ref={(c) => { this.idRef = c; }}
                                        returnKeyType="next"
                                        onSubmitEditing={() => { this.passwordRef.focus(); }}
                                        onChangeText={(value) => {this.onValueChange({ companyNo: value });}}
                                        value={this.state.companyNo}
                                    />
                                </View>
                                <View style={styles.textInput_view}>
                                    <Text>비밀번호</Text>
                                    <TextInput
                                        ref={(c) => { this.passwordRef = c; }}
                                        returnKeyType="next"
                                        onChangeText={(value) => this.onValueChange({passwd:value})}
                                        secureTextEntry={true}
                                        value={this.state.passwd}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: "-5%" }}>
                                    <TouchableOpacity style={{ flexDirection: 'row' }} activeOpacity={0.8} onPress={this.autoLoginCheckButtonChecked}>
                                        <IconRadio name={this.state.autoLoginChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'lightgrey'} style={{ paddingTop: 5 }} />
                                        <Text style={[styles.default_text, styles.radio_btn_text]}> 자동로그인  </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row' }} activeOpacity={0.8} onPress={this.rememberIdCheckButtonChecked}>
                                        <IconRadio name={this.state.rememberIdChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'lightgrey'} style={{ paddingTop: 5 }} />
                                        <Text style={[styles.default_text, styles.radio_btn_text]}> id기억  </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[styles.default_text, styles.login_guide_text]}>자동로그인 체크 이후에는 자동으로 로그인 됩니다.</Text>

                            </View>
                        </View>
                        <View style={styles.row_view}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.default_btn}>
                                <Text style={[styles.default_text, styles.pw_signup_text]}>비밀번호 찾기   </Text>
                            </TouchableOpacity>
                            <Text style={[styles.default_text, styles.pw_signup_text]}>|</Text>
                            <TouchableOpacity activeOpacity={0.8} style={styles.default_btn} onPress={this.registerUserButtonClicked}>
                                <Text style={[styles.default_text, styles.pw_signup_text]}>   회원가입</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    {/* 상품 등록하기 버튼 부분*/}
                    {this.state.validForm ?
                        (<TouchableOpacity activeOpacity={0.8} style={[styles.default_btn, styles.enable_login_btn]} onPress={this.loginButtonClicked}>
                            <Text style={[styles.default_text, styles.login_btn_text]}>로그인</Text>
                        </TouchableOpacity>)
                        : (<TouchableOpacity activeOpacity={0.8} style={[styles.default_btn, styles.disable_login_btn]}>
                            <Text style={[styles.default_text, styles.login_btn_text]}>로그인</Text>
                        </TouchableOpacity>)}
                </View>
            </>
        )
    }
}

export default Login;
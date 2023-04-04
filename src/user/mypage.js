import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert, BackHandler } from 'react-native';
import { template } from "../styles/template/page_style";
import { styles } from "../styles/mypage";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from 'react-native-vector-icons/AntDesign';
import IconLeaf from 'react-native-vector-icons/FontAwesome';
import IconList from 'react-native-vector-icons/Feather'
import { ScrollView } from 'react-native-gesture-handler';
import WebServiceManager from '../util/webservice_manager';
import Constant from '../util/constatnt_variables';

import FunctionUtil from '../util/libraries_function';


class MyPage extends Component {
  constructor(props) {
    super(props);
    this.idRef = React.createRef();
    this.passwordRef = React.createRef();
    this.state = {
      companyNo: null,
    }
  }

  componentDidMount() {
    this.getLoginInfo().then((value) => {
      this.setState({ companyNo: value.slice(0, 3) + "-" + value.slice(3, 5) + "-" + value.slice(5, 10) });
    });
    /*FunctionUtil.isLogined().then((response) => {
      const companyNo = response.companyNo;
      this.setState({ companyNo: companyNo.slice(0, 3) + "-" + companyNo.slice(3, 5) + "-" + companyNo.slice(5, 10) });
    });*/
  }

  async getLoginInfo() {
    let obj = await AsyncStorage.getItem('obj')
    let parsed = JSON.parse(obj);
    if (obj !== null) {
      return parsed.companyNo;
    }
    else {
      return false;
    }
  }

  logout = async () => {
    FunctionUtil.isLogined(this.props.navigation).then((response) => {
      console.log('login info ', response);
      const detailLogin = response.detailLogin;
      if (detailLogin == 0)
        AsyncStorage.clear();
      else if (detailLogin == 1) { // 자동로그인일 경우 로그아웃 시에도 항상 자동로그인 (30일 후 자동로그아웃 될 수 있도록 구현)
        const newObj = {
          companyNo: response.companyNo,
          passwd: response.passwd,
          id:response.id,
          detailLogin: 1
        };
        AsyncStorage.setItem('obj', JSON.stringify(newObj));
      }
      else if (detailLogin == 2) {
        const newObj = {
          companyNo: response.companyNo,
          passwd: '',
          id: response.id,
          detailLogin: 2
        };
        AsyncStorage.setItem('obj', JSON.stringify(newObj));
        console.log('logout async detail 2', newObj);
      }
      this.goExitApp();
    });}
  
  /*try {
    const obj = await AsyncStorage.getItem('obj');
    const {companyNo,passwd,detailLogin} = JSON.parse(obj);
    if(detailLogin==0 || detailLogin==1)
      AsyncStorage.clear();
    else if(detailLogin==2) {
      const newObj={
        companyNo:companyNo,
        passwd:'',
        detailLogin:2
      };
      AsyncStorage.setItem('obj', JSON.stringify(newObj));
      console.log('logout async detail 2',newObj);
    }
    this.goExitApp();

  } catch (error) {
    console.log(error);
  }*/


  goSalesListScreen = () => {
    this.props.navigation.navigate('SalesList')
  }
  goBuyListScreen = () => {
    this.props.navigation.navigate('BuyList')
  }
  goPickListScreen = () => {
    this.props.navigation.navigate('PickList')
  }
  goEditProfileScreen = () => {
    this.props.navigation.navigate('EditProfile');
  }
  goExitApp() {
    Alert.alert(
      '주의',
      '로그아웃하고 앱을 종료합니다.',
      [
        { text: '취소', onPress: () => { return false; } },
        { text: '확인', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false });
    return true;
  }

  render() {
    return (
      <>

        <View style={template.total_container}>

          {/*내정보 */}
          <View style={styles.viewHeaderLayout}>
            <View style={styles.container}>
              <View style={styles.item1}>
                <Text style={styles.name_text}>엠카즈 정비소</Text>
                <TouchableOpacity onPress={this.goEditProfileScreen}><Text style={styles.number_text}>{this.state.companyNo}</Text></TouchableOpacity>
                <Text>부산광역시 해운대구 우동 128,</Text>
                <Text>(가나다빌딩, 1005호)</Text>
              </View>

              <View style={styles.item2}>
                <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                  <Icon name="setting" size={30} color={'black'}></Icon>
                  <Text style={styles.btn_text}>설정</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                  <IconLeaf name="leaf" size={30} color={'#1BAC33'}></IconLeaf>
                  <Text style={styles.btn_text}>탄소포인트</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_pay} activeOpacity={0.8}>
                  <Icon name="creditcard" size={30} color={'black'}></Icon>
                  <Text style={styles.btn_text}>결제정보</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/*설정 */}
          <View style={styles.viewBodyLayout}>
            <TouchableOpacity onPress={this.goSalesListScreen}>
              <View style={styles.btn_select}>
                <View style={styles.textView}>
                  <IconList name="file-text" size={20} color={'black'}></IconList>
                  <Text style={styles.btn_select_text}>   판매내역</Text>
                </View>
                <View style={styles.iconView}>
                  <Icon name="right" size={20} color={'black'}></Icon>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.goBuyListScreen}>
              <View style={styles.btn_select}>
                <View style={styles.textView}>
                  <IconList name="shopping-bag" size={20} color={'black'}></IconList>
                  <Text style={styles.btn_select_text}>   구매내역</Text>
                </View>
                <View style={styles.iconView}>
                  <Icon name="right" size={20} color={'black'}></Icon>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.goPickListScreen}>
              <View style={styles.btn_select}>
                <View style={styles.textView}>
                  <IconList name="heart" size={20} color={'black'}></IconList>
                  <Text style={styles.btn_select_text}>   관심목록</Text>
                </View>
                <View style={styles.iconView}>
                  <Icon name="right" size={20} color={'black'}></Icon>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/*로그아웃 */}
          <View style={styles.viewBottomLayout}>
            <TouchableOpacity activeOpacity={0.8} style={styles.btn_logout} onPress={this.logout}>
              <Text style={styles.btn_logout_text}>로그아웃</Text>
            </TouchableOpacity>
          </View>

        </View>

      </>


    );
  }

}
export default MyPage;
import React, { Component, PureComponent } from 'react';
import {
    ScrollView, Pressable, TextInput, ImageBackground, View, Text,
    Image, FlatList, TouchableOpacity, Modal, Animated, BackHandler, Alert, NativeModules
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import FunctionUtil from '../../../util/libraries_function';
import { Picker } from '@react-native-picker/picker';
import Indicator from '../../../util/indicator';
import Constant from "../../../util/constatnt_variables";
import Session from '../../../util/session';
import WebServiceManager from "../../../util/webservice_manager";
import EmptyListView from '../../../util/empty_list_view';
import Sessions from '../../../util/session';
import { styles } from "../../../styles/list/home_4";

import Icon from 'react-native-vector-icons/MaterialIcons';
import ListItem from './item_4';

//import { SearchWebView } from "./web_view";

class Home1 extends Component {
    constructor(props) {
        super(props);
        this.contents = [];  //모든 users값 가져오는 것
        this.AnimatedHeaderValue = new Animated.Value(0); // Animated 기준값(0,0)
        this.userID = Session.getUserID();

        //안드로이드에서 정의한 모듈 가져옴
        const { ImageModule } = NativeModules;
        this.imageModule = ImageModule;

        this.state = {
            isRefresh: false,
            emptyListViewVisible:1,
            goodsContent: [],
            indicator: false,
            recentRadioButtonChecked: true,
            abcRadioButtonChecked: false,

            goodsQuantity: null,
            quality: 1,
        };
        console.log("Session",Session.isLoggedin());
    }

    componentDidMount() {
        this.goGetGoods(Session.getUserID());
        BackHandler.addEventListener("hardwareBackPress", this.backPressed); //뒤로가기 이벤트
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }

    //부품 검색
    search = (value) => {
        console.log('selected data: ', value);
        this.setState({
            number: value,
        });
        this.setState({ goodsContent: this.dataFiltering(value) },()=>{this.handleEmptyListView()})
    };

    //필터링 (부품번호, 부품명 동시 검색)
    dataFiltering = (value) => {
        let goodsContent = this.contents;
        goodsContent = goodsContent.filter((content) => {
            if (value === '')
                return true;
            else {
                if (content.number === value)
                    return true;
                if (content.name.includes(value))
                    return true;
                /*if(content.hashTag.includes(value))
                    return true;*/
            }
        });
        return goodsContent;
    }

    // 품번인식 카메라로 이동 goCameraButtonClicked
    goCameraButtonClicked = () => {
        this.props.navigation.push("PartsNoCamera", { onResultListener: this.goPartsNo });
    }

    // 품번 가지고오는 함수
    goPartsNo = (imageURI) => {
        this.callPartsNoAPI(imageURI).then((response) => {
            if (response.success === "1") {
                const partsNo = response.texts[0].replaceAll(" ", "");

                this.search(partsNo);
            }
            else {
                Alert.alert('부품번호 인식', '부품번호를 인식하지 못했습니다. 직접 입력하세요', [
                    { text: '확인', onPress: () => { this.setState({ number: "" }) } }]);
            }

            this.imageModule.deleteImage(imageURI, (imageURI) => {
                console.log(imageURI);
            }, (imageURI) => {
                console.log("delete success", imageURI);
            });
        });
    }

    //부품 목록 호출 메서드
    goGetGoods = () => {
        console.log('refresh_home');
        this.setState({ indicator: true });
        this.callGetGoodsAPI().then((response) => {
            this.contents = response;
            const goodsQuantity = Object.keys(response).length;
            console.log("상품 총 갯수 :", goodsQuantity);//response는 json자체
            this.setState({ indicator: false, goodsContent: response, goodsQuantity: goodsQuantity },()=>{this.handleEmptyListView()});
        });
        console.log('refresh success')
        this.setState({ isRefresh: false })
    }

    dateSort = () => { //최신순
        this.setState({ indicator: true });
        this.setState({ recentRadioButtonChecked: true, abcRadioButtonChecked: false });
        const sortedData = this.state.goodsContent.sort((a, b) => {
            return new Date(b.registerDate) - new Date(a.registerDate);
        });
        this.setState({ goodsContent: sortedData },()=>{this.handleEmptyListView()});
        this.setState({ indicator: false });
    }

    abcSort = () => { //가나다순
        this.setState({ indicator: true });
        this.setState({ recentRadioButtonChecked: false, abcRadioButtonChecked: true });

        const sortedData = this.state.goodsContent.sort((a, b) => {
            return a.name.localeCompare(b.name);
        })
        this.setState({ goodsContent: sortedData },()=>{this.handleEmptyListView()});
        this.setState({ indicator: false });
    }

    handleEmptyListView=()=>{
        if(this.state.goodsContent.length==0){
            this.setState({emptyListViewVisible:0});
        }
        else{
            this.setState({emptyListViewVisible:1});
        }
    }

    //Web Service 시작
    //사진으로부터 품번 인식 서비스 API
    async callPartsNoAPI(imageURI) {
        let manager = new WebServiceManager(Constant.externalServiceURL + "/api/paper/DetectTexts", "post");
        manager.addBinaryData("file", {
            uri: imageURI,
            type: "image/jpeg",
            name: "file"
        });
        let response = await manager.start();
        if (response.ok)
            return response.json();
    }

    //등록된 상품 리스트 API
    async callGetGoodsAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoods?login_id=" + this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    //Web Service 끝

    //UI관련 메서드들
    //뒤로가기 했을 때 앱 종료
    backPressed = () => {
        Alert.alert(
            '',
            '앱을 종료하시겠습니까?',
            [
                { text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: '확인', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }


    render() {
        const Header_Maximum_Height = 180;
        const Header_Minimum_Height = 60;

        const renderHeader = this.AnimatedHeaderValue.interpolate(
            {
                inputRange: [0, Header_Maximum_Height],
                outputRange: [0, -Header_Maximum_Height],
            });

        const renderSearchBar = this.AnimatedHeaderValue.interpolate(
            {
                inputRange: [0, Header_Maximum_Height],
                outputRange: [Header_Maximum_Height, 0],
                extrapolate: 'clamp'
            });

        return (
            <>
                <Modal transparent={true} visible={this.state.indicator}>
                    <Indicator />
                </Modal>
                <View style={{ flex: 1, backgroundColor: '#FFFF' }}>
                    {this.state.emptyListViewVisible==1 && <Animated.FlatList
                        data={this.state.goodsContent}
                        renderItem={({ item, index }) => <ListItem index={index} item={item} navigation={this.props.navigation} refreshListener={this.goGetGoods} />}
                        numColumns={2}
                        refreshing={this.state.isRefresh} //새로고침
                        onRefresh={this.goGetGoods}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ paddingTop: Header_Maximum_Height + Header_Minimum_Height + 30 }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }],
                            { useNativeDriver: true })}
                        />}
                    {this.state.emptyListViewVisible==0 && <EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetGoods} contentContainerStyle={{ paddingTop: Header_Maximum_Height }} />}

                    <Animated.View style={[styles.homeTop_view, { transform: [{ translateY: renderHeader }] }]}>
                        <View style={{ width: "100%", height: "100%" }}>
                            <View style={styles.title_view}>
                                <View style={styles.row_view}>
                                    <Text style={[styles.title_text, styles.titleBold_text]}>
                                        손쉽게 검색
                                    </Text>
                                    <Text style={[styles.title_text, styles.titleRegular_text]}>
                                        하고
                                    </Text>
                                </View>
                                <View style={styles.row_view}>
                                    <Text style={[styles.title_text, styles.titleBold_text]}>
                                        판매/구매
                                    </Text>
                                    <Text style={[styles.title_text, styles.titleRegular_text]}>
                                        까지 바로!
                                    </Text>
                                </View>
                                <Text style={styles.description_text}>
                                    원하는 키워드, 품번 사진으로 {'\n'} 바로 검색 가능합니다.
                                </Text>
                            </View>
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.searchBar_view, { height: Header_Minimum_Height, transform: [{ translateY: renderSearchBar }] }]}>
                        <View style={{ flexDirection: 'row', marginTop: '1%' }}>
                            <View style={styles.searchSection}>
                                <Icon style={{ padding: 10 }} name="search" size={20} color="#000" />
                                <TextInput
                                    onChange={(value) => this.search(value.nativeEvent.text)}
                                    placeholder="검색어를 입력해주세요."
                                    placeholderTextColor="light grey"
                                    style={styles.search_input}
                                    value={this.state.number}
                                />
                                {/* 카메라로 검색 */}

                            </View>
                            <View style={{ marginBottom: '1%' }}>
                                <TouchableOpacity
                                    style={styles.cameraSearch_button}
                                    onPress={this.goCameraButtonClicked}>
                                    <Image
                                        source={require('../../../images/icon/camera-icon/camera-icon.png')}
                                    />
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={styles.sortBar_view}>
                            <View style={{flex:1,marginLeft:'5%',flexDirection:'row'}}>
                                <Text style={{color:'black'}}>총 상품개수 : </Text>
                                <Text style={{color:'#113AE2'}}>{this.state.goodsQuantity}</Text><Text style={{color:'black'}}>개</Text>
                            </View>
                                <TouchableOpacity style={styles.row_view} activeOpacity={0.8} onPress={this.dateSort}>
                                    <Icon name={this.state.recentRadioButtonChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'blue'} />
                                        <Text style={styles.sortBar_text}> 최신순  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.row_view} activeOpacity={0.8} onPress={this.abcSort}>
                                    <Icon name={this.state.abcRadioButtonChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'blue'}  />
                                    <Text style={styles.sortBar_text}> 가나다순</Text>
                                </TouchableOpacity>   
                        </View>
                    </Animated.View>
                    
                </View>
            </>
        );
    }
}

export default Home1;
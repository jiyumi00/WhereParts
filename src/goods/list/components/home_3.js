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
import { styles } from "../../../styles/list/home_3";

import CarIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons';
import CameraIcon from 'react-native-vector-icons/SimpleLineIcons';
import ListItem from './item_3';

//import { SearchWebView } from "./web_view";

class Home extends Component {
    constructor(props) {
        super(props);
        this.contents = [];  //모든 users값 가져오는 것
        this.AnimatedHeaderValue = new Animated.Value(0); // Animated 기준값(0,0)
        this.userID = Session.getValue('id');

        //안드로이드에서 정의한 모듈 가져옴
        const { ImageModule } = NativeModules;
        this.imageModule = ImageModule;
        this.sortKind=["최신순","거리순","가나다순"];
        this.state = {
            isRefresh: false,
            emptyListViewVisible:1,
            goodsContent: [],
            indicator: false,
            recentRadioButtonChecked: true,
            abcRadioButtonChecked: false,

            goodsQuantity: null,
            quality: 1,
            sortedData:1,
        };
        console.log("Session",Session.isLoggedin());
    }

    componentDidMount() {
        this.goGetGoods(Session.getValue('id'));
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

    listSort=(value)=>{      
        if(value==1){
           this.setState({ indicator: true });
            const sortedData = this.state.goodsContent.sort((a, b) => {
                return new Date(b.registerDate) - new Date(a.registerDate);
            });
            this.setState({ goodsContent: sortedData },()=>{this.handleEmptyListView()});
            this.setState({ indicator: false });
        }
        else if(value==3){
            this.setState({ indicator: true });
            const sortedData = this.state.goodsContent.sort((a, b) => {
                return a.name.localeCompare(b.name);
            })
            this.setState({ goodsContent: sortedData },()=>{this.handleEmptyListView()});
            this.setState({ indicator: false });
        }     
    }
   /*  dateSort = () => { //최신순
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
    }  */
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
        const Header_Maximum_Height = 160;
        const Header_Minimum_Height = 120;

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
        console.log('sortKiond',this.state.sortedData)
        return (
            <>
                <Modal transparent={true} visible={this.state.indicator}>
                    <Indicator />
                </Modal>
                <View style={{ flex: 1,backgroundColor: '#FFFF',  }}>
                    {this.state.emptyListViewVisible==1 && <Animated.FlatList
                        data={this.state.goodsContent}
                        numColumns={2}
                        horizontal={false}
                        renderItem={({ item, index }) => <ListItem index={index} item={item} navigation={this.props.navigation} refreshListener={this.goGetGoods} />}
                        refreshing={this.state.isRefresh} //새로고침
                        onRefresh={this.goGetGoods}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: Header_Maximum_Height + Header_Minimum_Height + 10 }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.AnimatedHeaderValue } } }],
                            { useNativeDriver: true })}
                        />}
                    {this.state.emptyListViewVisible==0 && <EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetGoods} contentContainerStyle={{ paddingTop: Header_Maximum_Height }} />}

                    <Animated.View style={[styles.homeTop_view, { transform: [{ translateY: renderHeader }] }]}>
                        <View style={styles.title_view}>
                            <View style={styles.row_title_view}>
                                <Text style={[styles.title_text,{fontSize:25,}]}>
                                    <View style={{width:50,height:50,backgroundColor:'#D6DFF5', borderRadius:40,}}>
                                        <CarIcon name="car-wrench" size={50} color="#193067" /> 
                                    </View>
                                    내가 찾는 부품 
                                </Text>
                               
                            </View>
                            <View style={{paddingLeft:'5%'}}>
                                <Text style={[styles.titleBold_text]}>
                                    손쉽게 검색하고
                                </Text>
                                <Text style={[styles.titleBold_text]}>
                                    판매/ 구매까지 바로!
                                </Text>
                            </View>
                        </View>
                       
                    </Animated.View>

                    <Animated.View style={[styles.searchBar_view, { height: Header_Minimum_Height, transform: [{ translateY: renderSearchBar }] }]}>
                        <View style={{ flexDirection: 'row', marginTop: '7%', marginBottom: '2%' }}>
                            <View style={styles.searchSection}>
                                <Icon style={{ paddingLeft: 10 }} name="search" size={25} color="#193067" />
                                <TextInput
                                    onChange={(value) => this.search(value.nativeEvent.text)}
                                    placeholder="검색어를 입력해주세요."
                                    placeholderTextColor="light grey"
                                    style={styles.search_input}
                                    value={this.state.number}
                                />
                            </View>
                            {/* 카메라로 품번검색 */}
                            <View >
                                <TouchableOpacity
                                    style={styles.cameraSearch_button}
                                    onPress={this.goCameraButtonClicked}>
                                    <CameraIcon name="camera" size={25} color="#193067" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                            <View style={{ flex: 1, marginLeft: '5%', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'black' }}>총 상품개수 : </Text>
                                <Text style={{ color: '#113AE2' }}>{this.state.goodsQuantity}</Text><Text style={{ color: 'black' }}>개</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end',alignItems:'center', height:40}}>
                                <Picker
                                    style={{ width: 150 }}
                                    selectedValue={this.state.sortedData}
                                    onValueChange={(value, index) => { this.setState({ sortedData: value, }, () => this.listSort(value)) }}
                                    mode={'dropdown'}>
                                    {this.sortKind.map((item, i) => <Picker.Item label={item} key={i} value={i + 1} />)}
                                </Picker>
                            </View>
                            {/*   <TouchableOpacity style={styles.row_view} activeOpacity={0.8} onPress={this.dateSort}>
                                    <Icon name={this.state.recentRadioButtonChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'blue'} />
                                        <Text style={styles.sortBar_text}> 최신순  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.row_view} activeOpacity={0.8} onPress={this.abcSort}>
                                    <Icon name={this.state.abcRadioButtonChecked ? "check-circle" : "panorama-fish-eye"} size={20} color={'blue'}  />
                                    <Text style={styles.sortBar_text}> 가나다순</Text>
                                </TouchableOpacity>  */}

                        </View>
                    </Animated.View>      
                </View>
            </>
        );
    }
}

export default Home;
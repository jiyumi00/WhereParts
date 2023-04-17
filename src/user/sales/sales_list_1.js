import React, { Component, PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal, ImageBackground, BackHandler, ViewComponent } from 'react-native';

import { styles } from "../../styles/sales/saleslist_1";

import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';
import FunctionUtil from '../../util/libraries_function';

import EmptyListView from '../../util/empty_list_view';
import Session from '../../util/session';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMark from 'react-native-vector-icons/FontAwesome5';
import DetailItemView from "../../goods/list/item_detail";
import { color } from 'react-native-reanimated';


export default class SalesDetails extends Component {
    constructor(props) {
        super(props);

        this.contents = []; //soldoutContents
        this.userID = Session.getUserID();
        this.state = {
            salesContents: [],
            soldoutContents: [],

            saleState:1,

            isRefresh: false,

            emptySaleListViewVisible: false,
            emptySoldOutListViewVisible: false,
        };
    }

    componentDidMount() {
        if (Session.isLoggedin) {
            if (this.props.route.params != null) {
                this.setState({ saleState: this.props.route.params.saleState });
            }
            this.userID = Session.getUserID();
            this.goGetGoods();
            this.goGetSells();
        }
        else
            this.props.navigation.navigate('Login', { nextPage: "SalesList" });

        BackHandler.addEventListener("hardwareBackPress", this.backPressed); //뒤로가기 이벤트
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
    }
    goGetGoods = () => {
        //console.log("refresh selling");
        this.callGetGoodsAPI().then((response) => {
            this.setState({ salesContents: response }, () => { this.handleEmptySaleListView(this.state.salesContents.length) });
        })
    }
    goGetSells = () => {
        //console.log("refresh sell");
        this.callGetSellsAPI().then((response) => {
            this.contents = response;
            this.setState({ soldoutContents: this.dataFiltering() }, () => { this.handleEmptySoldOutListView(this.state.soldoutContents.length) });
        })
    }

    handleEmptySaleListView = (length) => {
        this.setState({ emptySaleListViewVisible: length == 0 ? true : false });
    }
    handleEmptySoldOutListView = (length) => {
        this.setState({ emptySoldOutListViewVisible: length == 0 ? true : false });
    }

    async callGetGoodsAPI() { //로그인 된 id값으로 올린 상품 가져오는 API
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoods?id=" + this.userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    async callGetSellsAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetSells?id=" + this.userID)
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    saleBarClicked = () => { //판매중
        this.setState({ saleState: 1 });
    }

    shippingBarClicked = () => { //배송정보입력
        this.setState({ saleState: 2 }, () => { this.setState({ soldoutContents: this.dataFiltering() }, () => { this.handleEmptySoldOutListView(this.state.soldoutContents.length) }) });
    }

    soldoutBarClicked = () => { //판매완료
        this.setState({ saleState: 3 }, () => { this.setState({ soldoutContents: this.dataFiltering() }, () => { this.handleEmptySoldOutListView(this.state.soldoutContents.length) }) });
    }
    dataFiltering() {
        let filteredContents = this.contents;
        if (this.state.saleState == 3) {
            filteredContents = filteredContents.filter((content) => {
                if (content.status == 3) {
                    return true;
                }
            })
        }
        else {
            filteredContents = filteredContents.filter((content) => {
                if (content.status == 1 || content.status == 2) {
                    return true;
                }
            })
        }
        console.log('[filter]', filteredContents);
        return filteredContents;
    }
    //뒤로가기 했을 때 앱 종료
    backPressed = () => {
        this.props.navigation.pop();
        this.props.navigation.push('TabHome', { initialTabMenu: "MyPage" });
        return true;
    }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.wrap}>
                    <View style={[styles.salesdetailsheader, { flexDirection: 'column', alignItems: 'flex-start', }]}>
                        <Text><IconMark name="pen" color={'#14127D'} size={15}/> 건수: <Text style={{color:'black'}}> 24건     </Text>
                        <IconMark name="coins" color={'#14127D'} size={15}/><Text> 판매금액: <Text style={{color:'black'}}> 1,300,000</Text></Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: "100%", }}>
                        <View style={{ borderBottomWidth: this.state.saleState == 1 ? 2 : 0, width: "33.3%", borderBottomColor: "#EE636A", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.saleBarClicked}><Text style={[styles.slidertext, { color: this.state.saleState == 1 ? "#EE636A" : "black" }]}>나의상품</Text></TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: this.state.saleState == 2 ? 2 : 0, width: "33.3%", borderBottomColor: "#EE636A", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.shippingBarClicked}><Text style={[styles.slidertext, { color: this.state.saleState == 2 ? "#EE636A" : "black" }]}>배송입력할 상품</Text></TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: this.state.saleState == 3 ? 2 : 0, width: "33.3%", borderBottomColor: "#EE636A", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.soldoutBarClicked}><Text style={[styles.slidertext, { color: this.state.saleState == 3 ? "#EE636A" : "black" }]}>판매완료</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ paddingVertical: '2%', flex: 1, paddingHorizontal: '4%' }}>
                    {this.state.saleState == 1 && this.state.emptySaleListViewVisible == false && (<FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.salesContents}
                        renderItem={({ item, index }) => <SaleListItem navigation={this.props.navigation} item={item} id={item.id} refreshListener={this.goGetGoods} />}
                        refreshing={this.state.isRefresh}
                        onRefresh={this.goGetGoods}
                        scrollEventThrottle={16}
                    />)}
                    {this.state.saleState != 1 && this.state.emptySoldOutListViewVisible == false && (<FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.state.soldoutContents}
                        renderItem={({ item, index }) => <SoldOutListItem navigation={this.props.navigation} item={item} id={item.goodsID} refreshListener={this.goGetSells} />}
                        refreshing={this.state.isRefresh}
                        onRefresh={this.goGetSells}
                        scrollEventThrottle={16}
                    />)}

                    {this.state.saleState == 1 && this.state.emptySaleListViewVisible && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetGoods} />)}
                    {this.state.saleState != 1 && this.state.emptySoldOutListViewVisible && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetSells} />)}

                </View>

            </View>
        );
    }
}

class SaleListItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: null,
            isDetailViewModal: false,
        };
    }

    componentDidMount() {
        this.callGetGoodsImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURL: reader.result })
            }
        });
    }

    handleDetailViewModal = () => {
        this.props.navigation.navigate('GoodsDetail', { goodsID: this.props.item.id, sellerID: this.props.item.userID, refresh: this.props.refreshListener });
    }
    //부품번호에 대한 Goodle 검색창 보이기(Web View)
    goGoodsNumberWebView = () => {
        this.props.navigation.navigate('GoogleWebView', { url: 'http://www.google.com/search?q=' + this.props.item.number });
    }

    async callGetGoodsImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    render() {
        const item = this.props.item;
        return (
            <>
                <TouchableOpacity onPress={this.handleDetailViewModal}>
                    <View style={styles.product}>
                        <View style={{ borderBottomColor: '#D1D1D1', borderBottomWidth: 1, flexDirection: 'row', paddingBottom: '2%' }}>
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <Text style={styles.itemNameText}>{item.name}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                {item.valid == 0 && <Text style={{ fontSize: 14 }}>숨김</Text>}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 5, paddingTop: '3%', paddingBottom: '2%' }}>
                            <View style={styles.imageView}>
                                <Image
                                    source={{ uri: this.state.imageURL }}
                                    style={styles.productImage} />
                            </View>
                            <View style={[styles.productInfo, { paddingLeft: '2%', alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                                {/*  <Text style={styles.itemNameText}>{item.name}</Text> */}
                                <TouchableOpacity onPress={this.goGoodsNumberWebView}><Text style={styles.itemNumberText}><Text style={{ color: 'grey'}}>부품번호 : </Text>{item.number}</Text></TouchableOpacity>
                                <Text style={styles.itemPriceText}><Text style={{ color: 'grey'}}>가격/수량 : </Text>{FunctionUtil.getPrice(item.price)}<Text>원 / {item.quantity}{"개"}</Text></Text>
                                <Text style={styles.itemRegisterDateText}><Text style={{ color: 'grey'}}>등록일 : </Text>{item.registerDate.slice(0, 10)}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <Modal animationType="slide" transparent={true} visible={this.state.isDetailViewModal}>
                    <DetailItemView detailViewModalListener={(value) => { this.setState({ isDetailViewModal: value }) }} item={item} />
                </Modal>
            </>
        );
    }
}

class SoldOutListItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: null,
        };
    }

    componentDidMount() {
        this.callGetGoodsImageAPI().then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURL: reader.result })
            }
        });
    }
    goDeliveryDetailScreen = () => {
        const logisInfo = { code: "04", invoice: "651969374875" };
        this.props.navigation.navigate('DeliveryDetail', { logisInfo: logisInfo });
    }

    //부품번호에 대한 Goodle 검색창 보이기(Web View)
    goGoodsNumberWebView = () => {
        this.props.navigation.navigate('GoogleWebView', { url: 'http://www.google.com/search?q=' + this.props.item.goodsNo });
    }

    async callGetGoodsImageAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + this.props.id + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    render() {
        const item = this.props.item;

        return (
            <>
                <View style={[styles.product, { flexDirection: 'column' }]}>
                    <View style={{ paddingBottom: '2%', borderBottomWidth: 1, borderColor: '#E9E9E9', flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={styles.itemNameText}>{item.goodsName}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 16, color: 'black' }}>{item.quantity}{"개"}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingBottom: '2%', paddingTop: '2%' }}>
                        {item.status != 3 && <>
                            <View style={styles.productInfo}>
                                <Text style={{ fontSize: 15, fontFamily: 'Pretendard-Medium', color: 'black' }}><Text style={{ color: 'grey', fontSize: 15 }}>주문번호: </Text>{item.orderNo}</Text>                               
                                <TouchableOpacity onPress={this.goGoodsNumberWebView}>
                                    <Text style={[styles.itemNumberText, { color: 'grey', fontSize: 15, }]}>부품번호:
                                        <Text style={{ color: 'blue' }}>{item.goodsNo}</Text>
                                    </Text>
                                </TouchableOpacity>   
                                <Text style={styles.itemPriceText}><Text style={{ color: 'grey', fontSize: 15 }}>결제: </Text>{FunctionUtil.getPrice(item.price * item.quantity)}원/<Text style={{ fontSize: 15, color: 'black' }}>카드</Text></Text>
                                <Text style={styles.itemRegisterDateText}><Text style={{ color: 'grey', fontSize: 15 }}>주문일: </Text>{item.orderingDate.slice(0, 10)}</Text>
                            </View>
                        </>}

                        <View style={styles.imageView}>
                            <Image
                                source={{ uri: this.state.imageURL }}
                                style={styles.productImage} />
                        </View>

                        {item.status == 3 && <>
                            <View style={[styles.productInfo, { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                                <View style={{ flex: 1, alignItems:'flex-end' }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'Pretendard-Medium', color: 'black' }}><Text style={{ color: 'grey'}}>주문번호: </Text> {item.orderNo}</Text>
                                    <Text style={[styles.itemRegisterDateText,{fontSize:14}]}><Text style={{ color: 'grey' }}>주문: </Text> {item.days[0].slice(0, 10)}</Text>
                                    <Text style={[styles.itemPriceText,{fontSize:14}]}><Text style={{ color: 'grey'}}>결제:</Text> {FunctionUtil.getPrice(item.price * item.quantity)}원/<Text>{item.payKind}</Text></Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, alignItems: 'flex-end',  borderColor: 'grey', paddingRight: '1%' }}>
                                    <Text style={[styles.itemRegisterDateText,{fontSize:14}]}><Text style={{ color: 'grey'}}>배송/완료: </Text>{item.days[1].slice(0, 10)} /</Text>
                                      {/*   <TouchableOpacity onPress={this.goGoodsNumberWebView}><Text style={styles.itemNumberText}>{item.goodsNo}</Text></TouchableOpacity> */}
                                        
                                    </View>
                                    <View style={{ alignItems: 'flex-end', }}>
                                        <Text style={[styles.itemRegisterDateText,{fontSize:14}]}>{item.days[2].slice(0, 10)}</Text>
                                    </View>
                                </View>
                            </View>
                        </>}


                    </View>
                    {item.status == 1 && <TouchableOpacity style={[styles.productInfoRight]} onPress={() => this.props.navigation.navigate('AddDelivery', { id: item.id, navigation: this.props.navigation, refresh: this.props.refreshListener })}>
                        <Text style={[styles.itemDistanceText, { color: "blue" }]}>배송등록</Text>
                    </TouchableOpacity>}

                    {item.status == 2 &&
                        <>
                            <TouchableOpacity style={styles.productInfoRight} onPress={this.goDeliveryDetailScreen}>
                                <Text style={[styles.itemDistanceText, { color: "blue" }]}><Text style={[styles.itemDistanceText]}>운송장번호: </Text>{item.invoiceNo} </Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
            </>
        );
    }
}
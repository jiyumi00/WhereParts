import React, { Component, PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal, ImageBackground } from 'react-native';

import { styles } from "../../styles/saleslist";

import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmptyListView from '../../util/empty_list_view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DetailItemView from "../../goods/list/components/item_detail";
import { color } from 'react-native-reanimated';


export default class SalesDetails extends Component {
    constructor(props) {
        super(props);
        this.contents = [];
        this.state = {
            salesContents: [],
            soldoutContents: [],

            saleState:1,
           
            isRefresh:false,
            emptyListViewVisible:1,
        };
    }

    componentDidMount() {
        //console.log('[ComponentDidempty확인]',this.state.emptyListViewVisible)
        if(this.props.route.params!=null){
            this.setState({ saleState: this.props.route.params.saleState} )
            
        }
         this.goGetGoods();
         this.goGetSells();
    }

  

    goGetGoods = () => {
        //console.log("refresh selling");
        this.getUserID().then((value)=> {
            this.callGetGoodsAPI(value).then((response) => {
                this.setState({salesContents:response},()=>{this.handleEmptyListView(this.state.salesContents.length)});
            })
        });
    }
    goGetSells = () => {
        //console.log("refresh sell");
        this.getUserID().then((value) => {
            this.callGetSellsAPI(value).then((response) => {
                this.contents=response;
                this.setState({ soldoutContents:response },()=>{this.handleEmptyListView(this.state.soldoutContents.length)});
            })
        });
    }
 
    handleEmptyListView = (length) => {
        //console.log("salesContents Length",this.state.salesContents.length);
        //console.log("soldoutContents Length",this.state.soldoutContents.length);
        if (length == 0) {
            this.setState({ emptyListViewVisible: 0 });
        }
        else {
            this.setState({ emptyListViewVisible: 1 });
        }
    }

    async callGetGoodsAPI(userID) { //로그인 된 id값으로 올린 상품 가져오는 API
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoods?id=" + userID);
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    async callGetSellsAPI(userID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetSells?id=" + userID)
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }

    async getUserID() {
        let obj = await AsyncStorage.getItem('obj')
        let parsed = JSON.parse(obj);
        if (obj !== null) {
            return parsed.id;
        }
        else {
            return false;
        }
    }

    saleBarClicked = () => { //판매중
        this.setState({ saleState:1 });
    }

    shippingBarClicked = () => { //배송정보입력
        this.setState({ saleState:2},()=>{this.setState({soldoutContents:this.dataFiltering()})});
    }

    soldoutBarClicked = () => { //판매완료
        this.setState({saleState:3},()=>{this.setState({soldoutContents:this.dataFiltering()})});
    }
    dataFiltering(){ 
        let filteredContents=this.contents;
        if(this.state.saleState==3){
            filteredContents=filteredContents.filter((content)=>{    
                if(content.status==3){
                    return true;
                }
            })
        }
        else {
            filteredContents=filteredContents.filter((content)=>{  
                if(content.status==1 || content.status==2){
                    return true;
                }
                
            })
        }
        console.log('[filter]',filteredContents);
        return filteredContents;
    }
    render() {
    
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.wrap}>
                    <View style={styles.salesdetailsheader}>
                        <Text style={styles.headertext}> 나의 판매내역</Text>
                        <Icon style={{ marginLeft: "58%" }} name="account-circle" size={60} color={'lightgrey'}></Icon>
                    </View>
                    <View style={{ flexDirection: 'row', width: "100%" }}>
                        <View style={{ borderBottomWidth: this.state.saleState==1 ? 1 : 0, width: "33.3%", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.saleBarClicked}><Text style={[styles.slidertext, { color: this.state.saleState==1 ? "#EE636A" : "black" }]}>판매중</Text></TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: this.state.saleState==2 ? 1 : 0, width: "33.3%", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.shippingBarClicked}><Text style={[styles.slidertext, { color: this.state.saleState==2 ? "#EE636A" : "black" }]}>배송입력할 상품</Text></TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: this.state.saleState==3 ? 1 : 0, width: "33.3%", alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.soldoutBarClicked}><Text style={[styles.slidertext, { color: this.state.saleState==3 ? "#EE636A" : "black" }]}>판매완료</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>

                {this.state.saleState==1 && this.state.emptyListViewVisible==1 && (<FlatList
                    data={this.state.salesContents}
                    renderItem={({ item, index }) => <SaleListItem navigation={this.props.navigation} item={item} id={item.id} refreshListener={this.goGetGoods} />}
                    refreshing={this.state.isRefresh}
                    onRefresh={this.goGetGoods}
                    scrollEventThrottle={16}
                />)}
                {this.state.saleState!=1 &&this.state.emptyListViewVisible==1 &&(<FlatList
                    data={this.state.soldoutContents}
                    renderItem={({ item, index }) => <SoldOutListItem navigation={this.props.navigation} item={item} id={item.goodsID} refreshListener={this.goGetSells} />}
                    refreshing={this.state.isRefresh}
                    onRefresh={this.goGetSells}
                    scrollEventThrottle={16}
                />)}
      
                {this.state.saleState==1 && this.state.emptyListViewVisible == 0 && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetGoods} />)}
                {this.state.saleState==2 && this.state.emptyListViewVisible == 0 && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetSells} />)}
                {this.state.saleState==3 && this.state.emptyListViewVisible == 0 && (<EmptyListView navigation={this.props.navigation} isRefresh={this.state.isRefresh} onRefreshListener={this.goGetSells} />)}
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
        this.props.navigation.navigate('GoodsDetail', { id: this.props.item.id, userID: this.props.item.userID, refresh:this.props.refreshListener});
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
                        <View style={styles.productRegisterDate}>
                            <Text style={styles.itemRegisterDateText}>등록일 {item.registerDate.slice(2, 10)}</Text>
                        </View>
                        {/*이미지 */}
                        <View style={styles.productImageView}>
                            <Image
                                source={{ uri: this.state.imageURL }}
                                style={styles.productImage} />

                            <View style={styles.productInfo}>
                                <View style={styles.productInfoLeft}>
                                    <Text style={styles.itemNameText}>{item.name}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.itemPriceText}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"}</Text>
                                        <Text style={{ fontSize: 17, color: 'lightgrey' }}> |</Text>
                                        <Text style={styles.itemPriceText}> {item.quantity}{"개"}</Text>
                                    </View>
                                    <Text style={styles.itemNumberText}>{item.number}</Text>
                                </View>
                            </View>
                            {item.valid == 0 && <View style={{ marginRight: '4%' }}>
                                <Text style={{ fontSize: 14 }}>숨김</Text>
                            </View>}
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
                
                    <View style={styles.product}>
                        <View style={styles.productRegisterDate}>
                            <Text style={styles.itemRegisterDateText}>주문일 {item.orderingDate.slice(2, 10)}</Text>
                        </View>
                        {/*이미지 */}
                        <View style={styles.productImageView}>
                            <Image
                                source={{ uri: this.state.imageURL }}
                                style={styles.productImage} />

                            <View style={styles.productInfo}>
                                <View style={styles.productInfoLeft}>
                                    <Text style={styles.itemNameText}>{item.goodsName}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.itemPriceText}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{"원"}</Text>
                                        <Text style={{ fontSize: 17, color: 'lightgrey' }}> |</Text>
                                        <Text style={styles.itemPriceText}> {item.quantity}{"개"}</Text>
                                    </View>
                                    <Text style={styles.itemNumberText}>{item.goodsNo}</Text>
                                </View>
                            </View>
                        </View>
                        {item.status == 1 && <TouchableOpacity style={styles.productInfoRight} onPress={() => this.props.navigation.navigate('AddDelivery', { id: item.id, navigation:this.props.navigation, refresh : this.props.refreshListener })}>
                            <Text style={[styles.itemDistanceText, { color: "blue" }]}>배송등록</Text>
                        </TouchableOpacity>}

                        {item.status == 2 && <TouchableOpacity style={styles.productInfoRight}>
                            <Text style={styles.itemDistanceText}>배송등록완료</Text>
                        </TouchableOpacity>}

                    </View>
                    
            </>
        );
    }
}


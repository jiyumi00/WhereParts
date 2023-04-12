import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, NativeModules,Pressable, TextInput,Image,Keyboard, Alert } from 'react-native';

import Constant from '../../util/constatnt_variables';
import WebServiceManager from '../../util/webservice_manager';
import FunctionUtil from '../../util/libraries_function';
import { template } from "../../styles/template/page_style";
import { styles } from "../../styles/payment";
import Icon from 'react-native-vector-icons/AntDesign';
class Payment extends Component {
    constructor(props) {
        super(props);

        this.buyerName = React.createRef();
        this.buyerTel = React.createRef();

        this.item = this.props.route.params.item;
        this.userID = this.props.route.params.userID;

        this.state={
            imageURL:null,
            zipNo:"",
            roadAddr:"",
            validForm:false,
            detailAddress:'',

            quantity:1,
            paymentMethod:1,
            buyerName:"",
            buyerTel:"",
            address:"",
            bigo:"",
            orderNo:null
        }
    }

    componentDidMount(){
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    
        console.log('item=',this.item);
        this.callGetGoodsImageAPI(this.item.id).then((response) => {
            let reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onloadend = () => {
                this.setState({ imageURL: reader.result })
            }
        });

        this.callGetOrderNoAPI().then((response)=> {
            console.log('orderNo',response);
            if(response.success==1)
                this.setState({orderNo:response.orderNo});
            else {
                Alert.alert('구매불가', '일시적인 오류로 상품을 구매할 수 없습니다.', [
                    { text: '확인', onPress: () => {this.props.navigation.pop()} },
                ]);
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
        this.onValueChange();
    }

    countPlus=()=>{
        if( this.state.quantity>0 && this.state.quantity < this.item.quantity)
            this.setState({quantity:this.state.quantity+1});
    }

    countMinus=()=>{
        if (this.state.quantity <= 1) {
            this.setState({ quantity: 1 });
        }
        else {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    }

    getAddressInfo=(zipNo, roadAddr)=>{
        /*this.addressInfoRender(zipNo,roadAddr).then(this.onValueChange);*/
        this.onValueChange({zipNo:zipNo, roadAddr:roadAddr});
    }

    /*async addressInfoRender(zipNo, roadAddr){
        this.setState({zipNo:zipNo, roadAddr:roadAddr});
    }*/

    onValueChange=(value)=>{
        this.setState(value,()=>{
            let isValidForm = true;

            console.log("zipNo",this.state.zipNo.trim().length);
            console.log("roadAddr",this.state.roadAddr.trim().length);
            //주문자
            if(this.state.buyerName.length == 0){
                isValidForm=false;
            }
            //연락처
            if(this.state.buyerTel.length==0){
                isValidForm=false;
            }
            //우편번호
            if(this.state.zipNo.trim().length==0){
                isValidForm=false;
            }
            //도로명주소
            if(this.state.roadAddr.trim().length==0){
                isValidForm=false;
            }
            //상세주소
            if(this.state.detailAddress.length==0){
                isValidForm=false;
            }
    
            this.setState({ validForm: isValidForm });
        });
    }

    //결제하기 버튼 클릭시
    paymentButtonClicked = () => { 
        const {id,name,price} = this.item;       
        const payload = { 
            orderNo:this.state.orderNo,
            goodsName:name,
            goodsID:id,
            quantity:this.state.quantity,
            price:price
        };        
        this.callAndroidPaymentActivity(payload);
    }

    //안드로이 네이티브 결제 액티비티 호출
    callAndroidPaymentActivity = (payload) => {
        console.log("결제정보",payload);
        const { ActivityStartModule } = NativeModules;
        ActivityStartModule.startPayment(JSON.stringify(payload), failedListener = (message) => {
            console.log('취소',message);
        }, successListener = (message) => {
            console.log('완료',message);
            const paymentData = JSON.parse(message);
            console.log('data=',paymentData.data);            
            const addOrderData = this.getAddOrderData(paymentData)
            console.log('payment data=',addOrderData);
            
            this.callAddOrderAPI(addOrderData).then((response)=> {
                console.log('addOrder response message',response);
                this.props.navigation.navigate('PayComplete',{orderID:response.success});
            });
        });
    }

    //AddOrder API호출에 필요한 데이터 생성
    getAddOrderData=(paymentData)=> {
        //const cardData = JSON.parse(paymentData.card_data);
        const address = this.state.roadAddr+" "+this.state.detailAddress;
        const {orderNo,quantity,buyerName,buyerTel,bigo} = this.state;
        const {id,price} = this.item;

        const payload = {
            orderNo:orderNo,
            buyerID:this.userID,
            goodsID:id,
            quantity:quantity,
            price:price,
            //total:paymentData.data.price,
            total:quantity*price,
            buyerName:buyerName,
            buyerTel:buyerTel,
            payKind:paymentData.data.method_origin,
            payBank:paymentData.data.card_data.card_company,
            address:address,
            bigo:bigo,
            receiptID:paymentData.data.receipt_id,
            billURL:paymentData.data.receipt_url
        };
        return payload;
    }

    async callAddOrderAPI(formData){
        let manager = new WebServiceManager(Constant.serviceURL+"/AddOrder", "post");
        manager.addFormData("data",formData);
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }
    async callGetGoodsImageAPI(goodsID) {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetGoodsImage?id=" + goodsID + "&position=1");
        let response = await manager.start();
        if (response.ok)
            return response.blob();
    }

    async callGetOrderNoAPI() {
        let manager = new WebServiceManager(Constant.serviceURL + "/GetOrderNo?id=" + this.userID);
        let response = await manager.start();
        if(response.ok)
            return response.json();
    }

    render() {
     
        return (
            <View style={template.total_container}>
                <ScrollView style={template.ScrollView}>
                    <View style={styles.container}>
                        <View style={styles.indexView}>
                            <View style={styles.itemTopView}>
                                <Text style={styles.indexText}>{this.item.name}</Text>
                            </View>
                            <View style={styles.itemBodyView}>
                                <View style={styles.imageView}>
                                    <Image
                                        source={{ uri: this.state.imageURL }}
                                        style={styles.productImage} />
                                </View>
                                <View style={styles.itemInfoView}>
                                  <Text> 주문번호 | <Text style={{fontSize:15,color:'black'}}>{this.state.orderNo}</Text></Text>
                                  <Text> 품번 |  <Text style={{fontSize:15,color:'blue'}}>{this.item.number}</Text></Text>
                                    <Text> 구매가능 수량 | <Text style={{fontSize:15,color:'black'}}>{this.item.quantity}개</Text></Text>
                                </View>
                            </View>
                            <View style={styles.itemBottomView}>
                                <View style={{flex:1,justifyContent:'center'}}>
                                <Text style={styles.priceText}> {FunctionUtil.getPrice(this.item.price*this.state.quantity)}원 /<Text style={{fontSize:14,color:'gray'}}>{FunctionUtil.getPrice(this.item.price)}원</Text></Text> 
                                </View>
                                <View style={{flex:1,alignItems:'flex-end'}}>
                                    <View style={styles.selectQuantityView}>
                                        <TouchableOpacity onPress={() => this.countMinus(this.state.quantity)} style={styles.quantityItem}>
                                            <Icon name="minus" size={15} color="black" />
                                        </TouchableOpacity>

                                        <View style={[styles.quantityItem, styles.quantityCount]}>
                                            <Text style={styles.quantityItemText}>{this.state.quantity}</Text>
                                        </View>

                                        <TouchableOpacity onPress={() => this.countPlus(this.state.quantity)} style={styles.quantityItem}>
                                            <Icon name="plus" size={15} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                                                  
                        </View>

                       
                        {/* 주소 */}
                       
                        <View style={styles.deliverView}>
                            <Text style={styles.title}>배송지 정보</Text>
                            <TextInput style={styles.textInput}
                                ref={(c) => { this.buyerName = c; }}
                                returnKeyType = "next"
                                onSubmitEditing={() => { this.buyerTel.focus(); }}
                                placeholder="주문자 이름을 입력하세요"
                                onChangeText={(value) => this.onValueChange({ buyerName: value })}
                                //onEndEditing={(event)=> this.onValueChange()}
                                value={this.state.buyerName} />
                            <TextInput style={styles.textInput}
                                ref={(c) => { this.buyerTel = c; }}
                                returnKeyType = "next"
                                placeholder="휴대폰 번호를 입력하세요"
                                onChangeText={(value) => this.onValueChange({ buyerTel: value })}
                                //onEndEditing={(event)=> this.onValueChange()}
                                value={this.state.buyerTel} />
                        </View>
                        <Text style={styles.title}>주소</Text>
                        <View style={styles.rowLayout}>
                            
                            <TouchableOpacity activeOpacity={0.8} style={styles.number_text}  onPress={() => this.props.navigation.navigate("SearchAddress", {addressListener:this.getAddressInfo})} >
                                <Text style={styles.text}>{this.state.zipNo}</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={() => this.props.navigation.navigate("SearchAddress", {addressListener:this.getAddressInfo})}>
                                <Text style={styles.btn_text}>우편번호 찾기</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.address_text}>
                            <Text style={styles.text}>{this.state.roadAddr}</Text>
                        </View>

                        <TextInput style={styles.textInput}
                            placeholder="상세 주소를 입력하세요"
                            onChangeText={(value) => this.onValueChange({ detailAddress: value })}
                            //onEndEditing={(event)=> this.onValueChange()}
                            value={this.state.detailAddress} />

                        <TextInput style={styles.textInput}
                            placeholder="배송요청사항"
                            onChangeText={(value) => this.setState({ bigo: value })}
                            value={this.state.bigo} />
                                   
                    </View>
                </ScrollView>
                {
                    this.state.validForm ? 
                    (<TouchableOpacity style={styles.paymentButton} onPress={this.paymentButtonClicked}/*onPress={this.callAndroidPaymentActivity}*/><Text style={styles.buyButtonText}>결제하기</Text></TouchableOpacity>)
                    :(<TouchableOpacity style={[styles.paymentButton,{backgroundColor: "#C9CCD1"}]} ><Text style={styles.buyButtonText}>결제하기</Text></TouchableOpacity>)
                }
            </View>
        );
    }
}

export default Payment;
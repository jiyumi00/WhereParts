import React, { Component, PureComponent } from 'react';
import { View, Text,  TextInput, TouchableOpacity, FlatList,Keyboard,Modal} from 'react-native';

import { styles } from "../../styles/address_search";

import Icon from 'react-native-vector-icons/MaterialIcons';
import EmptyIcon from 'react-native-vector-icons/SimpleLineIcons';
import PageIcon from 'react-native-vector-icons/AntDesign'
import WebServiceManager from '../../util/webservice_manager';

import Indicator from '../../util/indicator';
import { Dark_Gray, Light_Gray, Main_Color } from '../../util/color';

class SearchAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addressContents:[],
            commonContents:[],
            searchText: "",
            searchViewVisible:false,
            emptyListViewVisible:false,
            page:1,
            totalCount:0,
            indicator:false,
        }
    }

    //검색 버튼을 눌렀을 때
    searchAddress=()=>{
        if(this.state.searchText == "")
        {
            alert("주소를 입력해주세요");
        }
        else{
            this.setState({page:1},()=>this.goGetAddress(this.state.page))
            this.setState({searchViewVisible:true});
            Keyboard.dismiss();
        }
    }
    goGetAddress=(page)=>{
        this.setState({indicator:true})
        this.callGetAddressAPI(page).then((response) => {
            this.setState({ addressContents: response.results.juso,commonContents: response.results.common,totalCount:response.results.common.totalCount,indicator:false,emptyListViewVisible:false }
                ,()=>{
                    if(this.state.addressContents.length==0){
                        this.setState({emptyListViewVisible:true})
                    }
                });
            //console.log('componentResponse',response)
        });
    }

    pageDownClicked=()=>{
        if (this.state.page > 1)
            this.setState({ page: this.state.page - 1 },()=>this.goGetAddress(this.state.page))
    }
    pageUpClicked=()=>{
        if (this.state.page < (this.state.totalCount / 4))
            this.setState({ page: this.state.page + 1 },()=>this.goGetAddress(this.state.page))
    }
    async callGetAddressAPI(page) {
        let manager = new WebServiceManager("https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDIzMDIwOTE3MzczMjExMzQ5Njg=&currentPage=" + page + "&countPerPage=4&keyword=" + this.state.searchText + "&resultType=json");
        let response = await manager.start();
        if (response.ok)
            return response.json();
        else
            Promise.reject(response);
    }
    render() {
        return (
            <View style={styles.total_container}> 
               <View style={styles.search_view}>
                    <View style={styles.search_input}>
                        <View style={styles.row_layout}>
                            <TextInput style={styles.input}
                                onChangeText={(text) => this.setState({ searchText: text  })}
                                onEndEditing={this.searchAddress }
                                placeholder="도로명 또는 지번을 입력하세요"
                                placeholderTextColor={Light_Gray} />
                            <TouchableOpacity style={styles.search_btn} onPress={this.searchAddress}>
                                <Icon name="search" size={30} color={Dark_Gray} />
                            </TouchableOpacity>
                        </View>
                    </View>
               </View>
               <View style={styles.content_view}>
               <Modal transparent={true} visible={this.state.indicator}>
                    <Indicator />
                </Modal>
                    {this.state.emptyListViewVisible && <>
                        <View style={{justifyContent:'center',alignItems:'center',paddingTop:'5%'}}>
                        <EmptyIcon name="exclamation" size={40} color={Light_Gray} />
                        <Text style={{marginTop:'5%'}}>검색 결과가 없습니다</Text>
                        </View>
                    </>}
                    {this.state.searchViewVisible?
                        
                        <FlatList
                        data={this.state.addressContents}
                        renderItem={({item,index})=><AddressItem item={item} navigation={this.props.navigation} addressListener={this.props.route.params.addressListener}/>}/> :
                        <>
                        <Text style={styles.title}>TIP</Text>
                        <Text style={styles.text}>도로명, 건물명, 지번 중 선택하여</Text>
                        <Text style={styles.text2}>입력하세요 </Text>
                        <Text style={styles.content}> 도로명 + 건물번호 <Text style={styles.content2}> 예) 테헤란로 152</Text></Text>
                        <Text style={styles.content}> 동/읍/면/리 + 번지 <Text style={styles.content2}> 예) 역삼동 737</Text> </Text>
                        <Text style={styles.content}> 건물명, 아파트명  <Text style={styles.content2}> 예) 삼성동 힐스테이트</Text></Text>
                        </>}
                   
               </View>
                {this.state.searchViewVisible&&this.state.emptyListViewVisible==false&&
                <View style={styles.page_view}>
                    <View style={styles.row_layout}>
                        <TouchableOpacity onPress={this.pageDownClicked} activeOpacity={0.8} >
                        <PageIcon name="leftsquareo" size={30} color={Dark_Gray} />
                        </TouchableOpacity>
                    
                        <Text  style={styles.text}>   <Text style={[styles.text,{color:Main_Color}]}>{this.state.page} </Text> / {Math.ceil(this.state.totalCount/4)}   </Text>
                        <TouchableOpacity onPress={this.pageUpClicked} activeOpacity={0.8}>
                            <PageIcon name="rightsquareo" size={30} color={Dark_Gray} />
                        </TouchableOpacity>
                    </View>
                </View>}
            </View>
        );
    }
}

class AddressItem extends PureComponent{
    constructor(props) {
        super(props);
    }
    addressItemClicked=(zipNo,roadAddr)=>{
        this.props.navigation.navigate('Payment');
        this.props.addressListener(zipNo, roadAddr);
    }
    render(){
        const { zipNo,roadAddr,jibunAddr } = this.props.item;
        return(
        <TouchableOpacity activeOpacity={0.8} onPress={()=>this.addressItemClicked(zipNo,roadAddr)}>
                <View style={styles.outputStyle}>
                    <View style={styles.row_layout}>
                        <View style={styles.titleLayout}>
                            
                            <View style={styles.flex}><Text>도로명</Text></View >
                            <View style={styles.flex}><Text>지번</Text></View >
                        </View>
                        <View style={styles.addressLayout}>
                            <View style={styles.flex}><Text style={{ color: "black" }}>{roadAddr} </Text></View >
                            <View style={styles.flex}><Text style={{ color: "black" }}>{jibunAddr}</Text></View >
                        </View>
                        <View style={styles.numberLayout}>
                            <Text style={[styles.text,{fontWeight:'600'}]}>{zipNo}</Text>
                        </View>
                    </View>
                </View>
        </TouchableOpacity>
        );
       
    }
}
export default SearchAddress;
import { StyleSheet } from 'react-native';
import { Light_Gray } from '../util/color';

export const styles = StyleSheet.create({
    total_container:{
        flex:1,
    },
    dateInfo_view:{
        flex:1,
        //borderWidth:1,
        paddingVertical:10,
        paddingHorizontal:10,
        backgroundColor:'white',
        marginBottom:10,
    },
    goodsInfo_view:{
        height:100,
        backgroundColor:'white',
        paddingVertical:10,
        paddingHorizontal:10,
        marginBottom:10,
    },
    payInfo_view:{
        
        backgroundColor:'white',
        paddingVertical:10,
        paddingHorizontal:10,
        marginBottom:10,
        //borderWidth:1,
    },
    payInfoTitle_view:{
        height:30,
        borderBottomWidth:2,
    },
    payInfoDetail_view:{
        marginTop:20,
        borderWidth:1,
        borderColor:Light_Gray,
        paddingVertical:10,
        paddingHorizontal:10,
        justifyContent:'center',
        //flexDirection:'row'
    },
    title_view:{
        flex:1,
        //borderWidth:1,
        justifyContent:'center',
    },
    info_view:{
        flex:3,
       // borderWidth:1,
        justifyContent:'center',
    },
    text:{
        fontsize:8,
        fontFamily:'Pretendard-SemiBold',
        marginBottom:5,
    },
    text_info:{
        fontsize:8,
        fontFamily:'Pretendard-SemiBold',
        marginBottom:5,
        color:'black'
    }
});
import { StyleSheet } from 'react-native';
import { Dark_Gray, Line_Color, Red_Color } from '../util/color';

export const styles = StyleSheet.create({
    goodsContent: {
        position: 'relative',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      },
      itemView:{
        padding:"3%",
        marginTop: "3%",
        marginLeft: "3%",
        marginRight: "3%",
        borderRadius: 10,
        backgroundColor:'white',
        borderWidth:2,
        borderColor:Line_Color,
      },
      dateView:{
        flex:1,
        flexDirection:'row',
      },
      productView: {
        flex:2,
        flexDirection: 'row',
        alignItems: 'center',
        //borderBottomColor:'#D1D1D1',
        //borderBottomWidth:1,
        paddingBottom:10,
       // borderWidth:1,
      },
      productButtonView:{
        height:35,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
      },
      payInfoButtonView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderRadius:5,
        borderColor: Dark_Gray,
        marginHorizontal:'2%',
        paddingVertical:'2%'
      },
      deliverInfoButtonView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
      },
      productImageView: {
        
        //borderWidth: 1,
        borderColor: Dark_Gray,
        borderStyle: 'solid',
        overflow: 'hidden',
      },
      productImage: {
        flex:1,
        margin:5,
        width: 80,
        height: 80,
        borderRadius: 6,
        
      },
      productInfo: {
        flex:3,
        height:70,
        flexDirection:'row',
        marginLeft:10,
        marginTop:5,
        marginBottom:5,
        marginRight:15,
      },
      productInfoLeft:{
        flex:4,
        height:70,
        //borderWidth:1,
      },
      productInfoRight:{
        flex:2.5,
        alignItems:'flex-end',
        //borderWidth:1,
      },
    
      productRegisterDate:{
        flex:1,
        justifyContent:'flex-end',
        
      },
      productStatus:{
        flex:1,
        justifyContent:'flex-start',
      },
      text:{
        fontSize:13,
        color:'black'
      },
      // item 글자 디자인
      itemNumberText: {
        fontSize: 15,
        fontFamily: 'Pretendard-SemiBold',
      },
     
      itemNameText: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Pretendard-Medium',
        color: 'black',
      },
      itemRegisterDateText:{
        fontSize: 15,
      },
      itemStausText:{
        fontSize: 15,
        color:Red_Color,
     
      },
      itemPriceText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Pretendard-SemiBold',
        color: 'black',
      },
});
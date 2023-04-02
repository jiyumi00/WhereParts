//Home Style
import { StyleSheet } from 'react-native';
import { Light_Gray, Line_Color } from '../util/color';
export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'white',
  },
  salesdetailsheader: {
    flexDirection: 'row',
    marginBottom: "5%",
    padding: "2%"
  },
  headertext: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-SemiBold',
    color: 'black',
  },
  slidertext: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-SemiBold',
    color: 'black',
    //marginLeft: "15%",
  },
  product: {
    flex: 1,
    //flexDirection: 'row',
    alignItems: 'center',
    borderWidth:2,
    borderColor:Line_Color,
    marginTop:"2%",
    marginLeft:"2%",
    marginRight:"2%",
    paddingBottom:"2%",
    borderRadius:10,
    backgroundColor: 'white',
  },

  productImageView: {
    marginLeft: 5,
    //borderWidth: 1,
    flexDirection:"row",
    borderColor: Line_Color,
    borderStyle: 'solid',
    overflow: 'hidden',
  },
  productImage: {
    flex: 1,
    margin: 5,
    width: 80,
    height: 80,
    borderRadius: 6,

  },
  productInfo: {
    flex: 3,
    height: 70,
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 15,
  },
  productInfoLeft: {
    flex: 4,
    height: 80,
    justifyContent:'center'
  },
  productInfoRight: {
    borderTopWidth:1,
    borderTopColor:Light_Gray,
    alignItems:'center',
    marginTop:'1%',
    paddingTop:'2%',
    width:"96%",
  },

  productRegisterDate: {
    alignItems:'flex-start',
    width:'100%',
    paddingTop:'2%',
    paddingLeft:'3%',
  },
  productDistance: {
    flex: 1,
    justifyContent: 'flex-start',
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
  itemRegisterDateText: {
    fontSize: 14
  },
  itemDistanceText: {
    fontSize: 15,
    fontFamily: 'Pretendard-SemiBold',
  },
  itemPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-SemiBold',
    color: 'black',
  },
});
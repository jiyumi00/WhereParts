import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  slidertext: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-SemiBold',
    color: '#000000',
    //marginLeft: "15%",
  },
  product: {
    flex: 1,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E9E9E9',
    marginTop: "2%",
    paddingBottom: "2%",
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  productTop_view: {
    flexDirection: 'row',
    width: "100%",
    marginBottom: 10
  },
  listItem_view: {
    //flex:1,
    flexDirection: 'row',
    width: "100%",
  },
  circleIcon_view: {
    flex: 2, alignItems: 'center', justifyContent: 'center', marginLeft: 7
  },
  itemkind_text: {
    color: "#0066FF",
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemDetail_view: {
    flex: 8,
    paddingTop: 5,
    paddingLeft: 10,
    justifyContent:'center'
  },
  itemDetail_text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  }
});
import { StyleSheet } from 'react-native';
import { Line_Color } from '../util/color';

export const styles = StyleSheet.create({
    slidertext: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Pretendard-SemiBold',
        color: 'black',
        //marginLeft: "15%",
      },

      product: {
        flex: 1,
        height:75,
        alignItems: 'center',
        justifyContent:'center',
        borderWidth:2,
        borderColor:Line_Color,
        marginTop:"2%",
        paddingBottom:"2%",
        borderRadius:10,
        backgroundColor: 'white',
      },
});
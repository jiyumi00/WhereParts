import {StyleSheet} from 'react-native';
import { Line_Color } from '../../util/color';

export const template= StyleSheet.create({
    total_container:{
     flex:1,
     backgroundColor:'white',
    },
    container:{
        flex:1,
        marginTop:30,
        marginLeft:30,
        marginRight:30,
    },
     textInput:{
        backgroundColor:Line_Color,
        marginBottom: 15,
        paddingHorizontal: 10,
        height: 55,
        borderRadius: 10,
        borderColor:Line_Color,
        borderWidth: 1,
     },
  });
  
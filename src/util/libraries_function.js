import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWindowDimensions } from "react-native";

export default class FunctionUtil {

    static async isLogined() {
        const obj = await AsyncStorage.getItem('obj');
        let value={companyNo:"",passwd:"",id:0,detailLogin:0,logined:false};
        if(obj!=null) {
            const {companyNo,passwd,id,detailLogin} = JSON.parse(obj); 
            if(id!=undefined)
                value={companyNo:companyNo,passwd:passwd,id:id,detailLogin:detailLogin,logined:true};
            else
                value={companyNo:companyNo,passwd:passwd,id:id,detailLogin:detailLogin,logined:false};
        }
        return value;
    }

    static getPrice(data){
       return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebServiceManager from "../util/webservice_manager";
import Constant from "./constatnt_variables";
import { useWindowDimensions } from "react-native";

export default class FunctionUtil {
    
    static async isLogined() {
        const obj = await AsyncStorage.getItem('obj');
        let value = { companyNo: "", passwd: "", id: 0, detailLogin: 0, logined: false };
        if (obj != null) {
            const { companyNo, passwd, id, detailLogin } = JSON.parse(obj);
            console.log("libraries_fuction(사업자번호, 패스워드, id, detailLogin) = ",companyNo,passwd,id,detailLogin)
            if (detailLogin == 0) {//로그인 방법을 아무것도 선택하지 않았을 경우
                value = { companyNo: "", passwd: "", id: id, detailLogin: detailLogin, logined: false };
            }
            else if (detailLogin == 1) {    //자동 로그인일 경우
                value = { companyNo: companyNo, passwd: passwd, id: id, detailLogin: detailLogin, logined: true };
                this.callLoginAPI(value).then((response) => {
                    console.log("자동 로그인 성공", response);
                });

            }
            else if (detailLogin == 2) { //id 기억일 경우
                value = { companyNo: companyNo, passwd: "", id: id, detailLogin: detailLogin, logined: false };
            }
            else { //null 값일 경우 ( 저장되어 있는 로그인 정보가 없다면)
                value = { companyNo: companyNo, passwd: passwd, id: id, detailLogin: detailLogin, logined: false };
            }
            return value;
        }
    }

    static async callLoginAPI(value) {
        const {companyNo,passwd} = value 
        let manager = new WebServiceManager(Constant.serviceURL + "/Login", "post");
        manager.addFormData("data", { companyNo: companyNo, passwd: passwd, deviceToken: "" });
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    static getPrice(data) {
        return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
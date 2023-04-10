import AsyncStorage from "@react-native-async-storage/async-storage";
import WebServiceManager from "../util/webservice_manager";
import Constant from "./constatnt_variables";
import { useWindowDimensions } from "react-native";
import Session from "./session";

export default class FunctionUtil {
    
    static async getLoginType() {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const firedDate = await AsyncStorage.getItem('firedDate');
        let value = { companyNo: "", passwd: "", id: 0, detailLogin: 0};
        if (userInfo != null) {
            const { companyNo, passwd, id, detailLogin } = JSON.parse(userInfo);
            console.log("libraries_fuction(사업자번호, 패스워드, id, detailLogin) = ",companyNo,passwd,id,detailLogin)
            if (detailLogin == 0) {//로그인 방법을 아무것도 선택하지 않았을 경우
                value = { companyNo: "", passwd: "", id: 0, detailLogin: 0};
            }
            else if (detailLogin == 1) {    //자동 로그인일 경우
                const today = parseInt(Date.now()/1000);
                if(firedDate.firedDate - today < 0)
                    value = { companyNo: "", passwd: "", id: 0, detailLogin: 0 };
                else
                    value = { companyNo: companyNo, passwd: passwd, id: 0, detailLogin: 1 };
            }
            else if (detailLogin == 2) { //id 기억일 경우
                value = { companyNo: companyNo, passwd: "", id: 0, detailLogin: 2 };
            }
            return value;
        }
        else{
            return value;
        }
    }

    static async goLogin(loginInfo){
        let success = await this.callLoginAPI(loginInfo).then((response) => {
            console.log("after login", response);
            if (response.id != 0) {
                let userInfo = {
                    id: response.id,
                    companyName: response.companyName,
                    companyAddress: response.companyAddress,
                    isLoggedin: true
                }
                Session.setItem(userInfo);
                
                if (loginInfo.isAutoLogin == false && loginInfo.detailLogin == 1) {
                    const firedDate = {
                        firedDate: parseInt(Date.now() / 1000) * Constant.asyncFiredTerm * 7,
                    }
                    AsyncStorage.setItem('firedDate', Json.stringify(firedDate));
                }

                userInfo = {
                    companyNo: response.companyNo,
                    passwd: response.passwd,
                    detailLogin: loginInfo.detailLogin,
                }
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                return true;
            }
            return false;
        });
        return success;
    }

    static async callLoginAPI(loginInfo) {
        const {companyNo,passwd, deviceToken} = loginInfo 
        let manager = new WebServiceManager(Constant.serviceURL + "/Login", "post");
        manager.addFormData("data", { companyNo: companyNo, passwd: passwd, deviceToken: deviceToken });
        let response = await manager.start();
        if (response.ok) {
            return response.json();
        }
    }

    static async loginInfo(){
        const obj = await AsyncStorage.getItem('userInfo');
        const { companyNo, passwd, id, detailLogin, companyName, companyAddress } = JSON.parse(obj);
        value = { companyNo: companyNo, passwd: passwd, id: id, detailLogin: detailLogin, companyName: companyName, companyAddress: companyAddress };
        return value;
    }

    static getPrice(data) {
        return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
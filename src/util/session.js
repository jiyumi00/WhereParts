/*
[userInfo:{
    id: "1234567890",
    companyName: "인제정비",
    companyAddress: "인제로 인제대학교",
    isLoggedin: true
    },
pageInfo:{
    prevPage:"BuyList",
    nextPage:"MyPage"
    }
]
*/
export default class Session {
    static #items=[];
    
    static setItem(key,item) {
        Session.#items[key]=item;
    }

    static getItem(key) {
        return Session.#items[key];
    }

    static setUserInfoItem(item) {
        Session.#items['userInfo']=item;
    }

    static setPageInfoItem(item) {
        Session.#items['pageInfo']=item;
    }

    static getUserInfoItem() {
        return Session.#items['userInfo'];
    }

    static getPageInfoItem() {
        return Session.#items['pageInfo'];
    }

    static isLoggedin() {
        return Session.#items['userInfo'].isLoggedin;
    }

    static getUserID() {
        return Session.#items['userInfo'].id;
    }

    static getNextPage() {
        return Session.#items['pageInfo'].nextPage;
    }

    static getPrevPage() {
        return Session.#items['pageInfo'].prevPage;
    }    

/*     static setNextPage(value) {
        Session.#items['pageInfo'].nextPage = value;
    } */
}
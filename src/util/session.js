export default class Session {
    static #items={};

    static setValue(key,value) {
        Session.#items[key]=value;
    }

    static getValue(key) {
        return Session.#items[key];
    }

    static setItem(item) {
        Session.#items=item;
    }

    static isLoggedin() {
        return Session.#items['isLoggedin'];
    }

    static getItem() {
        return Session.#items;
    }
}
export default class Constant {
    static serviceURL = "http://203.241.251.177/wparts";
    static externalServiceURL = "http://lab.pyunhan.co.kr";
    static asyncFiredTerm = 60*60*24;
    
    static getInvoiceNames() {
        return ["CJ대한통운","우체국택배","편의점택배","로젠택배","한진택배"];
    }
    static getGoodsQuality() {
        return ["S급","A급","B급"];
    }
}                                                            
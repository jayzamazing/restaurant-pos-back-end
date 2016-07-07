/*
 * Function that represents generic store object
 */
function Store() {
    this.state_tax = 0;
    this.tip = 0;
}
/*
 * Function to set state tax
 * @param items - state tax
 * @return resolve - taxes
 */
Store.prototype.addStateTax = function(item) {
    //set as promise
    return new Promise(function(resolve, reject) {
        //set objects tax
        this.state_tax = parseFloat(item) / 100;
        //return state tax
        resolve(this.state_tax);
    });
};
/*
 * Function to set tip
 * @param item - tip
 * @return resolve - tip
 */
Store.prototype.addTip = function(item) {
    //set as promise
    return new Promise(function(resolve) {
        //set this object tip
        this.tip = parseFloat(item) / 100;
        //send back tip
        resolve(this.tip);
    });
};
var exports = module.exports = Store;  

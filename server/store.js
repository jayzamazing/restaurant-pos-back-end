/*jshint esversion: 6 */
(function() {
    /*
     * Function that represents generic store object
     */
    function Store() {
        this.store_name = '';
        this.address = '';
        this.city = '';
        this.zip_code = '';
        this.state = '';
        this.state_tax = 0;
        this.recommended_tip = 0;
    }
    /*
     * Function to add name to the store
     * @param store_name - name of store
     * @resolve - name of store
     */
    Store.prototype.addStoreName = function(store_name) {
        var context = this;
        //set as promise
        return new Promise(function(resolve, reject) {
            //set store name
            context.store_name = store_name;
            //return store name
            resolve(context.store_name);
        });
    };
    /*
     * Function to add address to store
     * @param address - address of store
     * @resolve - address of store
     */
    Store.prototype.addAddress = function(address) {
        var context = this;
        //set as promise
        return new Promise(function(resolve, reject) {
            //set store name
            context.address = address;
            //return store name
            resolve(context.address);
        });
    };
    /*
     * Function to add city to store
     * @param city - city of store
     * @resolve - city of store
     */
    Store.prototype.addCity = function(city) {
        var context = this;
        //set as promise
        return new Promise(function(resolve, reject) {
            //set store name
            context.city = city;
            //return store name
            resolve(context.city);
        });
    };
    /*
     * Function to add zip code to store
     * @param zip_code - zip code of the store
     * @resolve - zip_code of store
     */
    Store.prototype.addZipCode = function(zip_code) {
        var context = this;
        //set as promise
        return new Promise(function(resolve, reject) {
            //set store name
            context.zip_code = zip_code;
            //return store name
            resolve(context.zip_code);
        });
    };
    /*
     * Function to add state to the store
     * @param state - state of the store
     * @resolve - state of the store
     */
    Store.prototype.addState = function(state) {
        var context = this;
        //set as promise
        return new Promise(function(resolve, reject) {
            //set store name
            context.state = state;
            //return store name
            resolve(context.state);
        });
    };
    /*
     * Function to set state tax
     * @param items - state tax
     * @return resolve - taxes
     */
    Store.prototype.addStateTax = function(tax) {
        var context = this;
        //set as promise
        return new Promise(function(resolve, reject) {
            //set objects tax
            context.state_tax = tax;
            //return state tax
            resolve(context.state_tax);
        });
    };
    /*
     * Function to set tip
     * @param item - tip
     * @return resolve - tip
     */
    Store.prototype.addTip = function(tip) {
        var context = this;
        //set as promise
        return new Promise(function(resolve) {
            //set this object tip
            context.recommended_tip = tip;
            //send back tip
            resolve(context.recommended_tip);
        });
    };
    var exports = module.exports = Store;
})();

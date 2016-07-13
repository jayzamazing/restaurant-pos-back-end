//import mongoose
var mongoose = require('mongoose');
//set the schema for this collection
var StoreSchema = new mongoose.Schema({
    store_name: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip_code: {
        type: Number,
        required: true
    },
    state_tax: {
        type: String,
        required: true
    },
    recommended_tip: {
        type: String,
        required: true
    }

});
//create collection variable based on schema
var Store = mongoose.model('store', StoreSchema);
/*
 * Function to create a store
 * @param name - name of store
 * @param address - address of store
 * @param city - city of store
 * @param state - state of store
 * @param zip - zip code of store
 * @param tax - local tax
 * @param tip - recommended tip
 */
Store.createStore = function(name, address, city, state, zip, tax, tip) {
    //return promise so this can be used in a promise chain
    return new Promise(function(resolve, reject) {
        //object to fill for query
        var store = {
                store_name: name,
                address: address,
                city: city,
                state: state,
                zip_code: zip,
                state_tax: tax,
                recommended_tip: tip
        };
        //add data to mongo
        Store.create(store, function(err, result) {
            //if there is an error or store is empty
            if (err || !result) {
                //send back error
                reject('Could not create store ' + name);
            }
            //otherwise send back success
            resolve('Created store ' + result);
        });
    });
};
/*
 *
 */
Store.getStore = function(name) {
    return new Promise(function(resolve, reject) {
        Store.findOne({
            store_name: name
        }, function(err, result) {
            if (err || !result) {
                reject('Could not read store ' + name);
            }
            resolve('Read store ' + result);
        });
    });
};
module.exports = Store;

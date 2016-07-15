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
 * @resolve/reject - show store / error
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
        //mongoose method to add data to mongo
        Store.create(store, function(err, result) {
            //if there is an error or store is empty
            if (err || !result) {
                //send back error
                reject('Could not create store ' + name);
            }
            //otherwise send back success
            resolve(result);
        });
    });
};
/*
 * Function to update a store
 * @param storeName - name of store to update
 * @param name - name of store
 * @param address - address of store
 * @param city - city of store
 * @param state - state of store
 * @param zip - zip code of store
 * @param tax - local tax
 * @param tip - recommended tip
 * @resolve/reject - show store / error
 */
Store.updateStore = function(storeName, name, address, city, state, zip, tax, tip) {
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
        //mongoose method to update store data to mongo
        Store.findOneAndUpdate(storeName, store, function(err, result) {
            //if there is an error or store is empty
            if (err || !result) {
                //send back error
                reject('Could not create store ' + name);
            }
            //otherwise send back success
            resolve(result);
        });
    });
};
/*
 * Function to retried the store info
 * @param name - name of the store to retrieve
 * @resolve/reject - store info / error message
 */
Store.getStore = function(name) {
    //return promise so this can be used in a promise chain
    return new Promise(function(resolve, reject) {
        //mongoose method to find store
        Store.findOne({
            store_name: name
        }, function(err, result) {
            //if there is an error or store is empty
            if (err || !result) {
                //send back error
                reject('Could not read store ' + name);
            }
            //otherwise send back success
            resolve(result);
        });
    });
};
/*
 * Function to delete store from mongodb
 * @param name - name of store to delete
 * @resolve/reject - message item was deleted / error
 */
Store.deleteStore = function(name) {
    //return promise so this can be used in a promise chain
    return new Promise(function(resolve, reject) {
        Store.findOneAndRemove(name, function(err, result) {
            //if there is an error or result is empty
            if (err || !result) {
                //send back error
                reject('Could not delete store: ' + name);
            }
            //otherwise send back success
            resolve(name);
        });
    });
};
module.exports = Store;

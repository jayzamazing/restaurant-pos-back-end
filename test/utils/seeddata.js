'use strict';
const faker = require('faker');
const {User} = require('../../models/users');
const {Store} = require('../../models/store');

//create a store info
const createStore = () => {
  return {
    storeNumber: faker.random.number(),
    storeName: faker.company.companyName(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zipCode: faker.address.zipCode(),
    stateTax: 6.5,
    recommendedTip: 20
  };
};
const createStoreDb = () => {
  const store = createStore();
  const {storeNumber, storeName, address, city, state, zipCode, stateTax, recommendedTip} = store;
  return Store.create({
    storeNumber,
    storeName,
    address,
    city,
    state,
    zipCode,
    stateTax,
    recommendedTip
  });
};
//create a user info, hash password, and keep track of original password
const createUser = () => {
  const password = faker.internet.password();
  return User.hashPassword(password)
  .then(hash => {
    return {
      username: faker.internet.email(),
      password: hash,
      unhashed: password
    };
  });
};
const createUserDB = () => {
  let store, user;
  return createStoreDb()
  .then(res => {
    store = res._id;
  })
  .then(() => createUser())
  .then(res => {
    user = res;
  })
  .then(() => {
    const {username, password} = user;
    return User.create({
      username,
      password,
      store
    });
  })
  .then(() => {
    return user;
  });
};
//create multiple users
const createUsers = count => {
const seedData = [];
let users = {};
for (let index = 0; index <= count; index++) {
  seedData.push(createUser());
}
//wait for all actions to complete before continuing
return Promise.all(seedData)
.then(seed => {
  users = seed;

return User.insertMany(seed);
})
.then(res => {
  //merge unhashed password with other user info
  return res.map((user, index) => {
    return {
      _id: user._id,
      username: user.username,
      password: user.password,
      unhashed: users[index].unhashed,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt
    };
  });
});
};
module.exports = {createUser, createUsers, createUserDB, createStoreDb};

'use strict';
const faker = require('faker');
const {User} = require('../../models/users');
const {Store} = require('../../models/store');
const {Categories} = require('../../models/categories');
const {Menu} = require('../../models/menu');
// const {Table} = require('../../models/table');

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
//create store in mongo db
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
  }).then(res => {
    return res;
  })
  .catch(err => {
    throw err;
  });
};
//create a user info, hash password, and keep track of original password
const createUser = (store, role) => {
  const password = faker.internet.password();
  return User.hashPassword(password)
  .then(hash => {
    return {
      username: faker.internet.email(),
      password: hash,
      unhashed: password,
      store,
      role
    };
  });
};
//create user in mongo db
const createUserDB = role => {
  let user;
  return createStoreDb()
  .then(res => createUser(res._id, role))
  .then(res => {
    user = res;
    const {username, password, store, role} = res;
    return User.create({
      username,
      password,
      store,
      role
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
const createCategory = () => {
  return { name: faker.commerce.product() };
};
//create multiple categories
const createCategoriesDB = count => {
  const seedData = [];
  const seedData2 = [];
  for (let index = 0; index <= count; index++) {
    let temp;
    //ensure that array does not contain duplicate items
    do {
      temp = faker.commerce.product();
    } while (seedData2.includes(temp));
    seedData.push({name: temp});
    seedData2.push(temp);
  }
  //wait for all actions to complete before continuing
  return Promise.all(seedData)
  .then(seed => Categories.insertMany(seed))
  .then(res => {
    return res.map(categories => {
      return {
        _id: categories._id,
        name: categories.name
      };
    });
  });
};
const createMenu = category => {
  return {
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    category
  };
};
//create multiple menu items
const createMenuDB = count => {
  return createCategoriesDB(count)
  .then(res => {
    const seedData = [];
    for (let index = 0; index < count; index++) {
      seedData.push(createMenu(res[index]._id));
    }
    return seedData;
  })
  //wait for all actions to complete before continuing
  .then(seedData => Promise.all(seedData))
  .then(seed => Menu.insertMany(seed))
  .then(res => {
    return res.map(menu => {
      return {
        id: menu._id,
        name: menu.name,
        category: menu.category,
        price: menu.price
      };
    });
  });
};
const createTable = (tableId, checkNumber, order) => {
  return {
    tableId,
    checkNumber,
    order
  };
};
module.exports = {
  createMenu,
  createMenuDB,
  createTable,
  createUser,
  createUsers,
  createUserDB,
  createStoreDb,
  createCategory,
  createCategoriesDB
};

'use strict';
const faker = require('faker');
const {User} = require('../../models/users');
//create a user, hash password, and keep track of original password
const createUser = () => {
const password = faker.internet.password();
  return User.hashPassword(password)
  .then(hash => {
    return {
      email: faker.internet.email(),
      password: hash,
      unhashed: password,
      fullName: faker.name.findName()
    };
  });
};
const createUserDB = () => {
  let user;
  return createUser()
  .then(res => {
    user = res;
  })
  .then(() => {
    const {email, password, fullName} = user;
    return User.create({
      email,
      password,
      fullName
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
      email: user.email,
      password: user.password,
      unhashed: users[index].unhashed,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt
    };
  });
});
};
module.exports = {createUser, createUsers, createUserDB};

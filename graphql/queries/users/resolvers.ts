const users = [{ name: 'Foo Bar', username: 'foobar' }];

const userResolvers = {
  Query: {
    users() {
      return users;
    },
  },
};

export { userResolvers };

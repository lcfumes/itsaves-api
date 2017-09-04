module.exports.setUsers = (users) => {
  this.token = '';
  this.users = {
    total: 0,
    _embedded: {},
  };

  if (users === undefined) {
    return;
  }

  let docs = users;
  if (!Array.isArray(users)) {
    docs = [
      users,
    ];
  }
  this.total = docs.length;

  this.users = {
    total: this.total,
    _embedded: docs,
  };
};

module.exports.setToken = (token) => {
  this.token = token;
};

module.exports.getUsers = () => {
  const users = this.users;
  if (this.token !== '') {
    users.token = this.token;
  }

  return users;
};

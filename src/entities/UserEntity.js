import _ from "lodash";

export default class UserEntity {
  
  constructor() {
    this.token = '';
    this.user = {
      _embedded: {},
    };
  }

  setToken(token) {
    this.token = token;
  }

  setUser(user) {
    if (_.size(user) === 0) {
      return false;
    }

    this.user = {
      _embedded: user,
    };

    return this.user;
  }

  getUser() {
    const user = this.user;
    if (this.token !== '') {
      user.token = this.token;
    }

    return user;
  }
}

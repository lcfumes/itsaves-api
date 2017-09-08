import _ from "lodash";

export default class BookmarksEntity {
  
  constructor() {
    this.bookmarks = {
      total: 0,
      _embedded: {},
    };
  }

  setBookmarks(bookmarks) {
    if (_.size(bookmarks) === 0) {
      return false;
    }

    this.bookmarks = {
      total: _.size(bookmarks),
      _embedded: bookmarks,
    };

    return this.bookmarks;
  }

  getBookmarks() {
    return this.bookmarks;
  }
}

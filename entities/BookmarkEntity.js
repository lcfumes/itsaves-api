module.exports.setBookmarks = (bookmarks) => {
  this.bookmarks = {
    total: 0,
    _embedded: {},
  };

  if (bookmarks === undefined) {
    return;
  }

  let docs = bookmarks;
  if (!Array.isArray(bookmarks)) {
    docs = [
      bookmarks,
    ];
  }
  this.total = docs.length;

  this.bookmarks = {
    total: this.total,
    _embedded: docs,
  };
};

module.exports.getBookmarks = () => {
  const bookmarks = this.bookmarks;
  return bookmarks;
};

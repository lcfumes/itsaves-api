module.exports.setBookmarks = (bookmarks, total) => {
  if (bookmarks === null) {
    return;
  }
  let docs = bookmarks;
  if (!Array.isArray(bookmarks)) {
    docs = [
      bookmarks,
    ];
  }
  this.count = docs.length;
  this.bookmarks = docs;
  this.total = total;
};

module.exports.getBookmarks = () => (
  {
    count: this.count,
    total: this.total,
    _embedded: this.bookmarks,
  }
);

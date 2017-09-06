module.exports.setCategories = (categories) => {
  this.categories = {
    total: 0,
    _embedded: {},
  };

  if (categories === undefined) {
    return;
  }

  let docs = categories;
  if (!Array.isArray(categories)) {
    docs = [
      categories,
    ];
  }
  this.total = docs.length;

  this.categories = {
    total: this.total,
    _embedded: docs,
  };
};

module.exports.getCategories = () => {
  const categories = this.categories;
  return categories;
};

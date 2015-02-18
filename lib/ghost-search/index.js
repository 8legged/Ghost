var lunr = require('lunr');
var idx = lunr(function () {
  this.ref('id');
  this.field('title', { boost: 10 });
  this.field('meta_description');
});

 // load up the index
exports.load = function(docs) {
  allDocuments = docs;
  var loaded = 0;
  docs.forEach(function(doc){
    idx.add(doc);
    loaded = loaded + 1;
  });
  return loaded;
};


 // run search
exports.search = function(term) {
  return idx.search(term).map(function(result) {
    var selection = allDocuments.filter(function(filtered){
      return filtered.id === parseInt(result.ref, 10);
    });
    return selection[0];
  });
};

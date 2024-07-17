const path = require('path')

const dirSearchAlias = path.resolve(__dirname, 'template/js/lib/search-engine')
const pathDslAlias = path.resolve(dirSearchAlias, 'dsl')

module.exports = () => ({
  resolve: {
    alias: {
      './lib/dsl': pathDslAlias,
      './../lib/dsl': pathDslAlias,
      '../lib/dsl': pathDslAlias,
      './base-config': path.resolve(__dirname, 'template/js/custom-js/html/ProductCard.html'),
      './base-config': path.resolve(__dirname, 'template/js/custom-js/js/ProductCard.js')
    }
  }
})
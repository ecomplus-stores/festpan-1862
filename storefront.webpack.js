const path = require('path')

module.exports = () => ({
  resolve: {
    alias: {
      './base-config': path.resolve(__dirname, 'template/js/custom-js/html/ProductCard.html'),
      './base-config': path.resolve(__dirname, 'template/js/custom-js/js/ProductCard.js')
    }
  }
})
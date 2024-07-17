export default {
    query: {
      bool: {
        // condition: only visible products
        filter: [
          {
            term: {
              visible: true
            }
          },
          {
            "nested": {
                "path": "specs",
                "query": {
                    "bool": {
                        "filter": [
                            {
                                "term": {
                                    "specs.grid": "lojas"
                                }
                            },
                            {
                                "terms": {
                                    "specs.text": [
                                        "Festcakes"
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }
        ]
      }
    },
    sort: [
      // available && quantity >= min_quantity
      {
        in_stock: {
          order: 'desc'
        }
      },
      '_score'
    ],
    aggs: {
      // ref.: https://github.com/elastic/elasticsearch/issues/5789
      specs: {
        nested: {
          path: 'specs'
        },
        aggs: {
          grid: {
            terms: {
              field: 'specs.grid',
              size: 60
            },
            aggs: {
              text: {
                terms: {
                  field: 'specs.text',
                  size: 100
                }
              }
            }
          }
        }
      },
      // Metric Aggregations
      min_price: {
        min: {
          field: 'price'
        }
      },
      max_price: {
        max: {
          field: 'price'
        }
      },
      avg_price: {
        avg: {
          field: 'price'
        }
      }
    }
  }
  
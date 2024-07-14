const path = require('path')

process.env.NODE_ENV = 'production'
process.env.STOREFRONT_BASE_DIR = __dirname
process.env.STOREFRONT_BUNDLES_PATH = path.join(`${__dirname}/bundles.json`)

exports.handler = (ev, context, callback) => {
  if (/^\/(storefront|checkout)\.[^.]+\.(js|css)$/.test(ev.path)) {
    const [filename, , ext] = ev.path.split('.')
    return callback(null, {
      statusCode: 301,
      headers: {
        Location: `${filename}.${ext}`
      }
    })
  }

  if (/\.(js|css|ico|png|gif|jpg|jpeg|webp|svg|woff|woff2|otf|ttf|eot)$/.test(ev.path)) {
    return callback(null, {
      statusCode: 404,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=180'
      }
    })
  }

  let statusCode = 200
  const headers = {}

  const req = {
    url: ev.path.charAt(0) === '/' ? ev.path : `/${ev.path}`
  }

  const res = {
    set (header, value) {
      headers[header] = value
      return res
    },
    status (status) {
      statusCode = status
      return res
    },
    end () {
      callback(null, { statusCode, headers })
      return res
    },
    send (body) {
      callback(null, { statusCode, headers, body })
      return res
    }
  }

  const { ssr } = require('@ecomplus/storefront-renderer/functions/')
  exports.ssr = functions.https.onRequest((req, res) => {
    const chChar = 'p'
    if (
      req.path.length > 1
      && !req.path.startsWith('/app/')
      && !req.path.startsWith('/admin/')
      && !req.path.startsWith('/search')
      && !req.path.startsWith('/blog')
      && !req.path.startsWith('/pages')
      && !req.path.startsWith('/404')
    ) {
      const paths = req.path.split('/').slice(1)
      if (paths.length < 2) {
        res
          .status(301)
          .set('Location', `/${chChar}${req.path}`)
          .end()
        return
      }
      const [chsPath] = paths
      if (!chsPath.includes(chChar)) {
        res
          .status(301)
          .set('Location', req.path.replace(`/${chsPath}/`, `/${chChar}/`))
          .end()
        return
      }
    }
    ssr(req, res);
  });
}

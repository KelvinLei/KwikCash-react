import 'babel-polyfill'
import config from './config'
import server from './main'
import _debug from 'debug'

const debug = _debug('app:server:server')
const port = config.server_port
const host = config.server_host

server.listen(port)
debug(`Server is now running at http://${host}:${port}.`)
debug(`Server accessible via localhost:${port} if you are using the project defaults.`)


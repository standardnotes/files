import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

// todo: remove
// console.log('crypto', window.crypto = require('crypto').webcrypto)
// globalThis.window.crypto = require('crypto').webcrypto;
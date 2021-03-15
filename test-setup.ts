import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(utc)
dayjs.extend(customParseFormat)
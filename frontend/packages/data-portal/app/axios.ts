import Axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'

export const axios =
  process.env.NODE_ENV === 'production' ? setupCache(Axios) : Axios

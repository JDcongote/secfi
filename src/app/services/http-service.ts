import axios from 'axios';
import {API_KEY, API_ROOT} from '../constants';
export const baseHost = API_ROOT!;
export const apiKey = API_KEY!;

export default axios.create({
  params: {
    apikey: apiKey,
  },
  headers: {
    'Content-type': 'application/json',
  },
});

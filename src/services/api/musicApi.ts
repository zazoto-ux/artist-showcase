import axios from 'axios';

const API_KEY = process.env.REACT_APP_LASTFM_API_KEY;
const BASE_URL = process.env.REACT_APP_LASTFM_API_BASE_URL;

export const lastFMApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    api_key: API_KEY,
    format: "json",
  },
});
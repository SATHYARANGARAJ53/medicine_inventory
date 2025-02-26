import axios from "axios";

axios.defaults.baseURL = "https://identitytoolkit.googleapis.com/v1";
const API_KEY = "AIzaSyC5RQfkKfyP9IkVqbhOwDu1prV4m1XNT_k";
const REGISTER_URL = `/accounts:signUp?key=${API_KEY}`;
const LOGIN_URL = `/accounts:signInWithPassword?key=${API_KEY}`;
const USER_DETAILS_URL = `/accounts:lookup?key=${API_KEY}`;
import { getUserData } from "./Storage";

export const registerApi = (inputs) => {
  let data = {
    displayName: inputs.name,
    email: inputs.email,
    password: inputs.password,
    district:inputs.district
  };
  return axios.post(REGISTER_URL, data);
};

export const loginApi = (inputs) => {
  let data = {
    email: inputs.email,
    password: inputs.password,
  };
  return axios.post(LOGIN_URL, data);
};

export const userDetailApi = () => {
  let data = { idToken: getUserData() };
  return axios.post(USER_DETAILS_URL, data);
};

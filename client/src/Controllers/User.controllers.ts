import axios from "axios";
import { IUserLogin } from "../components/Auth/Authform";
const proxyUrl = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export interface IUserRegisterControl {
  username: string;
  email: string;
  password: string;
  role: string;
  createdIn: string;
}

export interface IUserinfo {
  date: string;
}

const axiosConfigHeader = {
    Authorization: "bearer " + localStorage.getItem("user"),
  }

export const LoginUser = async (data: IUserLogin): Promise<any> => {
  const response = await axios.post(proxyUrl + "/auth/login", data);
  return response;
};

export const RegisterUser = async (
  data: IUserRegisterControl
): Promise<any> => {
  const response = await axios.post(proxyUrl + "/auth/register", data);
  return response;
};

export const GetUserInfo = async (data: IUserinfo): Promise<any> => {
  const response = await axios.post(proxyUrl + "/auth/userbasic", data, {
    headers: axiosConfigHeader,
  });
  return response;
};

export const GetDashBoardInfo = async (date: string): Promise<any> => {
  const response = await axios.post(proxyUrl + "/auth/dashboardinfo", {date}, {
    headers: axiosConfigHeader,
  });
  return response;
};
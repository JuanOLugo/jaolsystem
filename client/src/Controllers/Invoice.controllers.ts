import axios from "axios";
const proxyUrl = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

const axiosConfigHeader = {
  Authorization: "bearer " + localStorage.getItem("user"),
};

export const SaveInvoice = async (data: object): Promise<any> => {
  const response = await axios.post(proxyUrl + "/invoice/save", data, {
    headers: axiosConfigHeader,
  });
  return response;
};

export const GetInvoice = async (date: string): Promise<any> => {
  const response = await axios.post(proxyUrl + `/invoice/get`, {date} , {
    headers: axiosConfigHeader,
  });
  return response;
};

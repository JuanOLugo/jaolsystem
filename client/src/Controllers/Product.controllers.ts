import axios from "axios";
import { ProductSend } from "../components/Products/Createproducts";
const proxyUrl = "http://localhost:3000/api";
axios.defaults.withCredentials = true;



const axiosConfigHeader = {
    Authorization: "bearer " + localStorage.getItem("user"),
  }

export const GetCode = async (): Promise<any> => {
  const response = await axios.get(proxyUrl + "/product/code", {headers: axiosConfigHeader});
  return response;
};

export const CreateProduct = async (data: ProductSend): Promise<any> => {
  const response = await axios.post(proxyUrl + "/product/create", data, {headers: axiosConfigHeader});
  return response;
};



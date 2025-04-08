import axios from "axios";
import { ProductSend } from "../components/Products/Createproducts";
import { Product } from "../components/Products/Product-table";

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

export const GetMyProducts = async (data: object): Promise<any> => {
  const response = await axios.post(proxyUrl + "/product/get", data, {headers: axiosConfigHeader});
  return response;
};

export const DeleteProduct = async (data: object): Promise<any> => {
  const response = await axios.post(proxyUrl + "/product/delete", data, {headers: axiosConfigHeader});
  return response;
};


export const UpdateProduct = async (data: object): Promise<any> => {
  const response = await axios.post(proxyUrl + "/product/update", data, {headers: axiosConfigHeader});
  return response;
};

export const ProductByCode = async (data: string): Promise<any> => {
  if(data.length !== 4) return new Promise((resolve, reject) => reject("Codigo no valido"))
  const response = await axios.get(proxyUrl + "/product/getPbyCode/" + data, {headers: axiosConfigHeader});
  return response;
};

export const RegisterNewProducts = async (products: Product[] ): Promise<any> => {
  const response = await axios.post(proxyUrl + "/product/registernewproducts",  {products}, {headers: axiosConfigHeader});
  return response;
};





import axios from "axios";
import { ProductSend } from "../components/Products/Createproducts";
import { Seller } from "../components/Users/SellerManagment";
const proxyUrl = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

const axiosConfigHeader = {
  Authorization: "bearer " + localStorage.getItem("user"),
};

export const CreateSeller = async (seller: Seller): Promise<any> => {
  const response = await axios.post(
    proxyUrl + "/seller/create",
    { seller },
    { headers: axiosConfigHeader }
  );
  return response;
};

export const GetSellers = async (): Promise<any> => {
  const response = await axios.get(proxyUrl + "/seller/get", {
    headers: axiosConfigHeader,
  });
  return response;
};

export const DeleteSellers = async (SellerId: string): Promise<any> => {
  const response = await axios.post(
    proxyUrl + "/seller/delete",
    { SellerId },
    {
      headers: axiosConfigHeader,
    }
  );
  return response;
};

export const UpdateSellers = async (seller: Seller): Promise<any> => {
  const response = await axios.post(
    proxyUrl + "/seller/update",
    { seller },
    {
      headers: axiosConfigHeader,
    }
  );
  return response;
};

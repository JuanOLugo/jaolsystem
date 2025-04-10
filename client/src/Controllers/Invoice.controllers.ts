import axios from "axios";
import { InvoiceItem } from "../components/Sales/InvoiceEditModal";
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

export const DeleteInvoice = async (invoiceId: string): Promise<any> => {
  const response = await axios.post(proxyUrl + `/invoice/DELETE`, {invoiceId} , {
    headers: axiosConfigHeader,
  });
  return response;
};

export const GetProductInvoice = async (invoiceId: string): Promise<any> => {
  const response = await axios.post(proxyUrl + `/invoice/getProductsInvoice`, {invoiceId} , {
    headers: axiosConfigHeader,
  });
  return response;
};

export const UpdateInvoice = async (TotalInvoice: Array<InvoiceItem>): Promise<any> => {
  const response = await axios.post(proxyUrl + `/invoice/updateInvoice`, {TotalInvoice} , {
    headers: axiosConfigHeader,
  });
  return response;
};

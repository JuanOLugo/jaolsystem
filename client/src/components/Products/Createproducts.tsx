"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Save, DollarSign, Package, User, Clock } from "lucide-react";
import { CreateProduct, GetCode } from "../../Controllers/Product.controllers";
import ErrorToast from "../toast/ErrorToast";
import { Errorhandle, Succeshandle } from "../toast/ToastFunctions/ErrorHandle";
import SuccessToast from "../toast/SuccesToast";

interface IFormData {
  codigo: string;
  nombre: string;
  precioCosto: number | "";
  precioVenta: number | "";
  proveedor: string;
}

export interface ProductSend extends IFormData {
  date: string;
}

export default function Createproducts() {
  const defaultFormDataValue: IFormData = {
    codigo: "0000",
    nombre: "",
    precioCosto: "",
    precioVenta: "",
    proveedor: "",
  };
  const [Error, setError] = useState("");
  const [Success, setSuccess] = useState("");
  const [formData, setFormData] = useState<IFormData>(defaultFormDataValue);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSetCode = () =>
    GetCode()
      .then((data) => setFormData({ ...formData, codigo: data.data.codigo }))
      .catch((err) => Errorhandle(err.message, setError));

  useEffect(() => {
    if (localStorage.getItem("user")) {
      if (formData.codigo === "0000") {
        handleSetCode();
      }
    }
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let { codigo, nombre, precioCosto, precioVenta } = formData;

    if (
      codigo.length > 4 ||
      nombre.length < 1 ||
      precioCosto.toString().length < 1 ||
      precioVenta.toString().length < 1 
    )
      return Errorhandle("Rellene todo los campos", setError);

    //errors
    if (precioVenta == "" || precioCosto == "")
      return Errorhandle("Rellene todo los campos", setError);
    if (isNaN(precioCosto) || isNaN(precioVenta))
      return Errorhandle("Los precios deben ser numeros", setError);
    if (precioCosto > precioVenta)
      return Errorhandle(
        "El precio de venta no puede ser menor al costo",
        setError
      );
    if (precioCosto < 0 || precioVenta < 0)
      return Errorhandle("Los precios no pueden ser negativos", setError);

    const dataToSend: ProductSend = {
      ...formData,
      precioCosto: Number(precioCosto),
      precioVenta: Number(precioVenta),
      date: new Date().toLocaleDateString("es-co"),
      proveedor: "LOCAL"
    };

    // Crear el producto en la base de datos
    CreateProduct(dataToSend)
      .then((data) => {
        console.log(data);
        Succeshandle("Producto creado", setSuccess);
      })
      .catch((err) => console.log(err));

    setFormData(defaultFormDataValue);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col justify-center h-screen">
      <ErrorToast error={Error} />
      <SuccessToast success={Success} />
      <h1 className="text-3xl font-semibold text-blue-500 mb-6">
        Crear Producto
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Código de Producto */}
          <div>
            <label
              htmlFor="codigo"
              className="block text-sm font-medium text-blue-500 mb-1"
            >
              Código de Producto
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <Package size={18} />
              </span>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                minLength={4}
                maxLength={4}
                placeholder="Ingrese el código del producto"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Nombre del Producto */}
          <div className="md:col-span-1">
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-blue-500 mb-1"
            >
              Nombre del Producto
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre del producto"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Precios - Verticalmente uno al lado del otro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Precio de costo */}
          <div>
            <label
              htmlFor="precioCosto"
              className="block text-sm font-medium text-blue-500 mb-1"
            >
              Precio de costo
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <DollarSign size={18} />
              </span>
              <input
                type="number"
                id="precioCosto"
                name="precioCosto"
                value={formData.precioCosto}
                onChange={handleChange}
                placeholder="Ingrese el precio del producto"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Precio de venta */}
          <div>
            <label
              htmlFor="precioVenta"
              className="block text-sm font-medium text-blue-500 mb-1"
            >
              Precio de venta
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <DollarSign size={18} />
              </span>
              <input
                type="number"
                id="precioVenta"
                name="precioVenta"
                value={formData.precioVenta}
                onChange={handleChange}
                placeholder="Ingrese el precio del producto"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Proveedor */}
        <div>
          <label
            htmlFor="proveedor"
            className="block text-sm font-medium text-blue-500 mb-1"
          >
            Proveedor (Opcional)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <User size={18} />
            </span>
            <input
              type="text"
              id="proveedor"
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              placeholder="Ingrese el proveedor del producto"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          className="w-full flex items-center justify-center py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Save size={18} className="mr-2" />
          Guardar Producto
        </button>
      </form>
    </div>
  );
}

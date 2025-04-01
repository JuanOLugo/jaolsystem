"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  X,
  Save,
  Trash2,
  Plus,
  Minus,
  Search,
  ShoppingCart,
} from "lucide-react";
import { Product } from "../Products/Product-table";
import { GetMyProducts } from "../../Controllers/Product.controllers";
import { Errorhandle } from "../toast/ToastFunctions/ErrorHandle";

export interface InvoiceItem {
  productoId: Product;
  cantidad: number;
  precioCosto: number;
  precioVenta: number;
  descuento: number;
  facturacontenedora: string;
  creadoEn: string;
}

interface InvoiceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (products: InvoiceItem[]) => void;
  invoiceProducts: InvoiceItem[];
}

const InvoiceEditModal: React.FC<InvoiceEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  invoiceProducts: initialInvoiceProducts,
}) => {
  const [invoiceProducts, setInvoiceProducts] = useState<InvoiceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [Invoicetotal, setInvoicetotal] = useState(0);
  const [AvailableProducts, setAvailableProducts] = useState<Array<Product>>(
    []
  );
  const [UserChange, setUserChange] = useState(0);
  // Inicializar productos de la factura cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setInvoiceProducts(initialInvoiceProducts);
      console.log(initialInvoiceProducts);
      setSearchTerm("");
      setShowProductSelector(false);
    }
  }, [isOpen, initialInvoiceProducts]);

  // Calcular el total de la factura
  useEffect(() => {
    if (invoiceProducts) {
      const total = invoiceProducts.reduce(
        (total, product) => total + product.precioVenta * product.cantidad,
        0
      );

      // normal = 127.000
      const regularTotal = initialInvoiceProducts.reduce(
        (total, product) => total + product.precioVenta * product.cantidad,
        0
      );

      setInvoicetotal(total);

      setUserChange(total - regularTotal);
    }

    console.log(invoiceProducts);
  }, [invoiceProducts]);

  useEffect(() => {
    GetMyProducts({ cantidad: 50, skip: 0, filterProduct: searchTerm })
      .then((response) => {
        setAvailableProducts(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [searchTerm]);

  if (!isOpen) return null;

  type PlusMinus = "minus" | "plus";

  // Manejar cambio en la cantidad de un producto
  const handleQuantityChange = (id: string, change: PlusMinus) => {
    setInvoiceProducts((prevProducts) =>
      prevProducts.map((product) => {
        let newQuantity;
        if (product.productoId._id === id) {
          if (change == "minus") {
            newQuantity = product.cantidad - 1;
          } else {
            newQuantity = product.cantidad + 1;
          }
          return {
            ...product,
            cantidad: newQuantity,
          };
        }
        return product;
      })
    );
  };

  // Eliminar un producto de la factura
  const handleRemoveProduct = (id: string) => {
    setInvoiceProducts((prevProducts) =>
      prevProducts.filter((product) => product.productoId._id !== id)
    );
  };

  // Filtrar productos disponibles según el término de búsqueda
  const filteredAvailableProducts = AvailableProducts.filter(
    (product) =>
      !invoiceProducts.some((ip) => ip.productoId._id === product._id) && // No mostrar productos ya en la factura
      (product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigoBarra.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Añadir un producto a la factura
  const handleAddProduct = (product: Product) => {
    const newInvoiceProduct: InvoiceItem = {
      productoId: product,
      cantidad: 1,
      precioCosto: product.precioDeCosto,
      precioVenta: product.precioDeVenta,
      creadoEn: new Date().toLocaleDateString("es-co"),
      descuento: 0,
      facturacontenedora: invoiceProducts[0].facturacontenedora,
    };

    setInvoiceProducts((prev) => [...prev, newInvoiceProduct]);
    setSearchTerm("");
    setShowProductSelector(false);
  };

  // Guardar cambios en la factura
  const handleSave = () => {
    onSave(invoiceProducts);
    setInvoiceProducts([]);
    setSearchTerm("");
    setAvailableProducts([]);
    setShowProductSelector(false);

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <ShoppingCart className="mr-2 text-blue-500" size={20} />
            Editar Productos de la Factura
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabla de productos */}
          <div className="flex-1 overflow-y-auto p-6">
            {invoiceProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay productos en esta factura. Añada productos para
                continuar.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Producto
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Precio
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Cantidad
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Subtotal
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceProducts.map((product, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.productoId.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              Código: {product.productoId.codigoBarra}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.precioVenta.toLocaleString("es-co")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              if (product.cantidad !== 0) {
                                handleQuantityChange(
                                  product.productoId._id,
                                  "minus"
                                );
                              }
                            }}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {product.cantidad}
                          </span>
                          <button
                            onClick={() => {
                              if (product.cantidad > product.productoId.stock) {
                                alert(
                                  "Es la maxima cantidad de productos que hay"
                                );
                              } else
                                handleQuantityChange(
                                  product.productoId._id,
                                  "plus"
                                );
                            }}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        $
                        {(
                          product.precioVenta * product.cantidad
                        ).toLocaleString("es-co")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            handleRemoveProduct(product.productoId._id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Sección para añadir productos */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {showProductSelector ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Buscar producto por nombre o código..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowProductSelector(false)}
                    className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="max-h-40 overflow-y-auto bg-white rounded-lg border border-gray-200">
                  {filteredAvailableProducts.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">
                      No se encontraron productos
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {filteredAvailableProducts.map((product) => (
                        <li
                          key={product._id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          onClick={() => handleAddProduct(product)}
                        >
                          <div>
                            <p className="font-medium">{product.nombre}</p>
                            <p className="text-sm text-gray-500">
                              Código: {product.codigoBarra}
                            </p>
                          </div>
                          <span className="text-blue-600 font-medium">
                            ${product.precioDeVenta.toLocaleString("es-co")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex justify-around ">
                  <div className="mr-3">
                    <span className="text-lg font-medium  text-gray-700">
                      Total:
                    </span>
                    <span className="ml-2 text-xl font-bold text-blue-600">
                      ${Invoicetotal.toLocaleString("es-co")}
                    </span>
                  </div>

                  <div className={`${UserChange > 0
                        ? "text-green-500"
                        : UserChange < 0
                        ? "text-red-500"
                        : "text-yellow-500"}`}>
                    <span className={`text-lg font-medium`}>
                      {UserChange > 0
                        ? "Pedir: "
                        : UserChange < 0
                        ? "Devolver"
                        : "Exacto"}
                    </span>
                    <span className="ml-2 text-xl font-bold">
                      ${UserChange.toLocaleString("es-co")}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowProductSelector(true)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center transition-colors"
                  >
                    <Plus size={18} className="mr-2" />
                    Añadir Producto
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors"
                    disabled={invoiceProducts.length === 0}
                  >
                    <Save size={18} className="mr-2" />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditModal;

"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Plus,
  Edit,
  Trash2,
  Check,
  Package,
  DollarSign,
  Hash,
} from "lucide-react";
import { Product } from "./Product-table";
import { ProductByCode, RegisterNewProducts } from "../../Controllers/Product.controllers";
import FilterProduct from "../Invoicing/FilterProduct";
import { ProductExtend } from "../Invoicing/Invoicing";

interface ProductRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (products: Product[]) => void;
}



const ProductRegistrationModal: React.FC<ProductRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  // Estado para el formulario de producto
  const [productForm, setProductForm] = useState<ProductExtend>({
    _id: "",
    codigoBarra: "",
    nombre: "",
    precioDeCosto: 0,
    precioDeVenta: 0,
    proveedorNombre: "",
    creadoEn: "",
    actualizadoEn: "",
    stock: 1,
    discount: 0,
    realName: "",
    quantity: 1,
  });

  // Estado para la lista de productos
  const [products, setProducts] = useState<
    Product[]
  >([]);
  const [RecentProducts, setRecentProducts] = useState<
    Product[]
  >([]);
  // Estado para el producto en edición
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleChangeCode = async (value: string) => {
    setProductForm((prev) => ({ ...prev, codigoBarra: value.toUpperCase() }));
    if(!editingProductId){
      try {
        const isOnArray = products.find((p) => p.codigoBarra === value);
        if (isOnArray) {
          setProductForm((prev) => ({
            ...prev,
            codigoBarra: isOnArray.codigoBarra,
            _id: isOnArray._id,
            nombre: isOnArray.nombre,
            precioDeVenta: isOnArray.precioDeVenta,
            precioDeCosto: isOnArray.precioDeCosto,
            stock: 1,
            actualizadoEn: new Date().toLocaleDateString("es-co"),
          }));
        } else {
          const response = await ProductByCode(value);
          const { codigoBarra, nombre, precioDeVenta, _id, precioDeCosto } =
            response.data.data;
          setRecentProducts([...RecentProducts, response.data.data]);
          setProductForm((prev) => ({
            ...prev,
            codigoBarra: codigoBarra,
            _id,
            nombre: nombre,
            realName: nombre,
            precioDeVenta: parseInt(precioDeVenta),
            precioDeCosto: precioDeCosto,
            stock: 1,
            actualizadoEn: new Date().toLocaleDateString("es-co"),
          }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    setProductForm({
      _id: "",
      codigoBarra: "",
      nombre: "",
      precioDeCosto: 0,
      precioDeVenta: 0,
      proveedorNombre: "",
      creadoEn: "",
      actualizadoEn: "",
      stock: 1,
      discount: 0,
      realName: "",
      quantity: 1,
    });
    setProducts([]);
    setEditingProductId(null);
  }, [isOpen])
  

  // Manejar el cambio de código
  useEffect(() => {
    if (productForm.codigoBarra.length > 0) {
      handleChangeCode(productForm.codigoBarra);
    }
  }, [productForm.codigoBarra]);

  useEffect(() => {
    console.log(products)
  }, [products])

  
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) || 0 : value,
    }));
  };

  // Agregar o actualizar producto
  const handleAddProduct = () => {
    // Validación básica
    if (
      !productForm.codigoBarra ||
      !productForm.nombre ||
      productForm.precioDeCosto <= 0 ||
      productForm.precioDeVenta <= 0
    ) {
      return; // Podríamos mostrar un mensaje de error aquí
    }

    if (editingProductId) {
      // Actualizar producto existente
      setProducts((prev) =>
        prev.map((product) =>
          product._id === editingProductId
            ? { ...productForm, _id: editingProductId }
            : product
        )
      );
      setEditingProductId(null);
    } else {
      // Agregar nuevo producto
      if(products.find((p) => p.codigoBarra === productForm.codigoBarra)){
        setProducts((prev) => prev.map((product) =>
          product.codigoBarra === productForm.codigoBarra
            ? { ...productForm, stock: product.stock + productForm.stock }
            : product
        ));
      } else {
        setProducts((prev) => [...prev, productForm]);
      }
    }

    // Resetear formulario
    setProductForm({
      _id: "",
      codigoBarra: "",
      nombre: "",
      precioDeCosto: 0,
      precioDeVenta: 0,
      proveedorNombre: "",
      creadoEn: "",
      actualizadoEn: "",
      stock: 1,
      discount: 0,
      realName: "",
      quantity: 1,
    });
  };

  // Editar producto
  const handleEditProduct = (
    product: Product
  ) => {
    setProductForm({
      _id: product._id,
      codigoBarra: product.codigoBarra,
      nombre: product.nombre,
      precioDeCosto: product.precioDeCosto,
      precioDeVenta: product.precioDeVenta,
      proveedorNombre: product.proveedorNombre,
      creadoEn: product.creadoEn,
      actualizadoEn: product.actualizadoEn,
      stock: product.stock,
      discount: 0,
      realName: "",
      quantity: 1,
    });
    setEditingProductId(product._id);
  };


  

  // Eliminar producto
  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product._id !== id));

    // Si estamos editando este producto, cancelar la edición
    if (editingProductId === id) {
      setEditingProductId(null);
      setProductForm({
        _id: "",
        codigoBarra: "",
        nombre: "",
        precioDeCosto: 0,
        precioDeVenta: 0,
        proveedorNombre: "",
        creadoEn: "",
        actualizadoEn: "",
        stock: 1,
        discount: 0,
        realName: "",
        quantity: 1,
      });
    }
  };

  // Guardar todos los productos
  const handleSaveAll = () => {
    onSave(products)
    
  };

  const Ref = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Registro de Productos
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          {/* Formulario de producto */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Código
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="code"
                    name="codigoBarra"
                    value={productForm.codigoBarra}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        codigoBarra: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Código"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre del Producto
                </label>
                <div className="relative">
                  <Package
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="name"
                    name="nombre"
                    ref={Ref}
                    value={productForm.nombre}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del producto"
                  />
                </div>
                <FilterProduct searchTerm={productForm.nombre} Ref={Ref} setCode={setProductForm}/>
              </div>

              <div>
                <label
                  htmlFor="costPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Precio de costo
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    id="costPrice"
                    name="precioDeCosto"
                    value={productForm.precioDeCosto}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="salePrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Precio de venta
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="number"
                    id="salePrice"
                    name="precioDeVenta"
                    value={productForm.precioDeVenta}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-6">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={productForm.stock}
                    onChange={handleInputChange}
                    className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors"
              >
                {editingProductId ? (
                  <>
                    <Check size={18} className="mr-2" />
                    Actualizar producto
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Agregar producto
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="flex-1 overflow-hidden">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Productos ingresados
            </h3>

            <div className="overflow-y-auto max-h-[calc(100vh-400px)] border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Código
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Precio Costo
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Precio Venta
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      stock
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
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No hay productos ingresados
                      </td>
                    </tr>
                  ) : (
                    products.map((product, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.codigoBarra}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.precioDeCosto.toLocaleString("es-co")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.precioDeVenta.toLocaleString("es-co")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleSaveAll}
              disabled={products.length === 0}
              className={`px-6 py-3 rounded-lg flex items-center transition-colors ${
                products.length === 0
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <Save size={18} className="mr-2" />
              Guardar registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRegistrationModal;

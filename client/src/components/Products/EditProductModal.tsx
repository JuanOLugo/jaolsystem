import React, { useEffect, useState } from "react";
import { IsOpenType, Product } from "./Product-table";
import {
  DollarSign,
  Hash,
  Minus,
  Package,
  Plus,
  Save,
  User,
  X,
} from "lucide-react";

interface ModalPorductProps {
  product: Product | null;
  isOpen: boolean;
  onClose: (product: Product) => Promise<void>;
  onSave: (product: Product) => void;
}

function EditProductModal({
  product,
  isOpen,
  onClose,
  onSave,
}: ModalPorductProps) {
  const [editedProduct, setEditedProduct] = useState<Product>({
    _id: "",
    nombre: "",
    precioDeCosto: 0,
    precioDeVenta: 0,
    stock: 0,
    codigoBarra: "",
    proveedorNombre: "",
    creadoEn: "",
    actualizadoEn: "",
  });
  const [customQuantity, setCustomQuantity] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setEditedProduct({
        ...product,
        actualizadoEn: new Date().toLocaleDateString("es-co"),
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]:
        name === "precioDeVenta" || name === "precioDeCosto" || name === "stock"
          ? Number.parseInt(value)
          : value,
    }));
  };

  const handleStockChange = (amount: number) => {
    setEditedProduct((prev) => ({
      ...prev,
      stock: Math.max(0, prev.stock + amount), // Asegurarse de que el stock no sea negativo
    }));
  };

  const handleCustomQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomQuantity(Number.parseInt(e.target.value) || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedProduct);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Editar Producto
          </h2>
          <button
            onClick={() => onClose(product)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código del producto (solo lectura) */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Código del Producto
              </label>
              <div className="relative">
                <Hash
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={editedProduct.codigoBarra}
                  className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
                  readOnly
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                El código no se puede editar
              </p>
            </div>

            {/* Nombre del producto */}
            <div>
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
                  id="nombre"
                  name="nombre"
                  value={editedProduct.nombre}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Precio de costo */}
            <div>
              <label
                htmlFor="precioDeCosto"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio de Costo
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  id="precioDeCosto"
                  name="precioDeCosto"
                  value={editedProduct.precioDeCosto}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Precio de venta */}
            <div>
              <label
                htmlFor="precioDeVenta"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio de Venta
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  id="precioDeVenta"
                  name="precioDeVenta"
                  value={editedProduct.precioDeVenta}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Proveedor */}
            <div>
              <label
                htmlFor="provider"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Proveedor
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  id="proveedorNombre"
                  name="proveedorNombre"
                  value={editedProduct.proveedorNombre}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock
              </label>
              <div className="relative">
                <Package
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={editedProduct.stock}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Controles de stock */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-3">
              Ajustar Stock
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleStockChange(-1)}
                className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Minus size={18} />
              </button>

              <button
                type="button"
                onClick={() => handleStockChange(1)}
                className="flex items-center justify-center p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Plus size={18} />
              </button>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={customQuantity}
                  onChange={handleCustomQuantityChange}
                  className="w-20 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />

                <button
                  type="button"
                  onClick={() => handleStockChange(customQuantity)}
                  className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Añadir
                </button>

                <button
                  type="button"
                  onClick={() => handleStockChange(-customQuantity)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Restar
                </button>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onClose(product)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <Save size={18} className="mr-2" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;

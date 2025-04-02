"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  User,
  Users,
  DollarSign,
  ShoppingCart,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
} from "lucide-react";
import {
  CreateSeller,
  DeleteSellers,
  GetSellers,
  UpdateSellers,
} from "../../Controllers/Seller.controllers";

export type Seller = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalSales: number;
  totalAmount: number;
  createdAt: string;
};


export type Vendedor = {
  vendedor: Seller,
  totalDeVentas: number,
  totalDeMonto: number,
}

const SellerManagement: React.FC = () => {
  // Estado para la lista de vendedores
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Estado para el formulario
  const [formData, setFormData] = useState<
    Omit<Seller, "_id" | "totalSales" | "totalAmount" | "createdAt">
  >({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Estado para el vendedor seleccionado (para edición)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  useEffect(() => {
    GetSellers()
      .then((data) => setSellers(data.data.map((e: Vendedor) => {
        return {
          ...e.vendedor,
          totalSales: e.totalDeVentas,
          totalAmount: e.totalDeMonto,
        }
      })))
      .catch((err) => console.log(err));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (selectedSeller) {
      // Actualizar vendedor existente
      const updatedSeller: Seller = {
        ...selectedSeller,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      };

      UpdateSellers(updatedSeller)
        .then((res) => {
          setSellers((prev) =>
            prev.map((seller) =>
              seller._id === selectedSeller._id
                ? {
                    ...seller,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                  }
                : seller
            )
          );
          setSelectedSeller(null);
        })
        .catch((err) => console.log(err));
    } else {
      // Crear nuevo vendedor
      const newSeller: Seller = {
        _id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || "example@ex.com",
        phone: formData.phone || "",
        totalSales: 0,
        totalAmount: 0,
        createdAt: new Date().toLocaleDateString("es-co"),
      };
      await CreateSeller(newSeller)
        .then((res) => setSellers((prev) => [...prev, newSeller]))
        .catch((err) => console.log(err));
    }

    // Resetear formulario
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  // Seleccionar vendedor para editar
  const handleEdit = (seller: Seller) => {
    setSelectedSeller(seller);
    setFormData({
      firstName: seller.firstName,
      lastName: seller.lastName,
      email: seller.email,
      phone: seller.phone,
    });
  };

  // Eliminar vendedor
  const handleDelete = (id: string) => {
    DeleteSellers(id)
      .then((data) => {
        setSellers((prev) => prev.filter((seller) => seller._id !== id));
      })
      .catch((err) => console.log(err));

    // Si estamos editando este vendedor, cancelar la edición
    if (selectedSeller && selectedSeller._id === id) {
      setSelectedSeller(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setSelectedSeller(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Gestión de Vendedores
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Vendedores */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-700 flex items-center">
                <Users className="mr-2 text-blue-500" size={20} />
                Vendedores Registrados
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {sellers.length} vendedores
              </span>
            </div>

            {sellers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                No hay vendedores registrados. Cree un nuevo vendedor para
                comenzar.
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {sellers.map((seller) => (
                  <div
                    key={seller._id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                          <User size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {seller.firstName} {seller.lastName}
                          </h3>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail size={14} className="mr-1" />
                            {seller.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone size={14} className="mr-1" />
                            {seller.phone}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(seller)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(seller._id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <ShoppingCart size={14} className="mr-1" />
                          Ventas Totales
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {seller.totalSales}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <DollarSign size={14} className="mr-1" />
                          Monto Total
                        </div>
                        <p className="text-lg font-semibold text-blue-600">
                          ${seller.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario de Creación/Edición */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-700 flex items-center mb-6">
              {selectedSeller ? (
                <>
                  <Edit className="mr-2 text-blue-500" size={20} />
                  Editar Vendedor
                </>
              ) : (
                <>
                  <Plus className="mr-2 text-blue-500" size={20} />
                  Nuevo Vendedor
                </>
              )}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    placeholder="Nombre"
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Telefono"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                {selectedSeller && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  {selectedSeller ? (
                    <>
                      <Edit size={18} className="mr-2" />
                      Actualizar Vendedor
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="mr-2" />
                      Crear Vendedor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerManagement;

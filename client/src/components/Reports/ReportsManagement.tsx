"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  FileText,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  Send,
  AlertTriangle,
} from "lucide-react";
import {
  DeleteReport,
  EditReport,
  GenerateReports,
  GetReports,
  GetSellers,
} from "../../Controllers/Seller.controllers";
import { Seller } from "../Users/SellerManagment";

export interface Report {
  _id: string;
  sellerId: Seller;
  sellerName: string;
  description: string;
  createdAt: string;
  isResolved: boolean;
}

const ReportsManagement: React.FC = () => {
  // Lista de vendedores (normalmente vendría de una API o base de datos)

  // Estado para la lista de reportes
  const [reports, setReports] = useState<Report[]>([]);

  const [Sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    GetSellers().then((res) => {
      setSellers(res.data.map((e: any) => e.vendedor));
    });

    GetReports()
      .then((res) => {
        setReports(res.data.reportes.reverse());
      })
      .catch((err) => console.log(err));
  }, []);

  type FormData = {
    sellerId: Seller;
    description: string;
  };

  // Estado para el formulario
  const [formData, setFormData] = useState<FormData>({
    sellerId: Sellers[0],
    description: "",
  });

  // Manejar cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "sellerId") {
      const filteredSeller = Sellers.find((seller) => seller._id === value);
      if (filteredSeller) {
        setFormData((prev) => ({
          ...prev,
          [name]: filteredSeller,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sellerId || !formData.description.trim()) {
      return; // Validación básica
    }

    const selectedSeller = Sellers.find(
      (seller) => seller._id === formData.sellerId._id
    );

    if (!selectedSeller) {
      return;
    }

    const newReport = {
      _id: Date.now().toString(),
      sellerId: formData.sellerId,
      sellerName: selectedSeller.firstName + " " + selectedSeller.lastName,
      description: formData.description.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      isResolved: false,
    };

    GenerateReports(newReport)
      .then((res) => {
        setReports((prev) => [res.data.nuevoReporteGuardado, ...prev]);
      })
      .catch((err) => console.log(err));

    // Resetear formulario
    setFormData({
      sellerId: Sellers[0],
      description: "",
    });
  };

  // Eliminar reporte
  const handleDeleteReport = (id: string) => {
    const findReport = reports.find((report) => report._id === id);
    if (!findReport) return;
    DeleteReport(findReport)
      .then((res) => {
        setReports((prev) => prev.filter((report) => report._id !== id));
      })
      .catch((err) => console.log(err));
  };

  // Cambiar estado del reporte (resuelto/pendiente)
  const handleToggleResolved = (id: string) => {
    if (!id) return;
    const reportFinded = reports.find((report) => {
      if (report._id === id) {
        report.isResolved = !report.isResolved;
        return report;
      }
      return null;
    });
    if (!reportFinded) return;

    EditReport(reportFinded)
      .then((res) => {
        setReports((prev) =>
          prev.map((report) => {
            if (report._id === res.data.reportes._id) {
              report.isResolved = !report.isResolved;
            }
            return report;
          })
        );
      })
      .catch((err) => console.log(err));
  };

  // Función para truncar texto largo
  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Gestión de Reportes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Reportes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-700 flex items-center">
                <FileText className="mr-2 text-blue-500" size={20} />
                Reportes
              </h2>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <AlertTriangle size={12} className="mr-1" />
                  {reports.filter((r) => !r.isResolved).length} pendientes
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  {reports.filter((r) => r.isResolved).length} resueltos
                </span>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                No hay reportes registrados.
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto h-[500px] pr-2">
                {reports.map((report, i) => (
                  <div
                    key={i}
                    className={`rounded-lg p-4 border-l-4 transition-colors ${
                      report.isResolved
                        ? "bg-green-50 border-l-green-500"
                        : "bg-yellow-50 border-l-yellow-500"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-700 mb-2">
                          {truncateText(report.description)}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <User size={12} className="mr-1" />
                            {report.sellerId
                              ? report.sellerId?.firstName
                              : "Vendedor no encontrado"}{" "}
                            {report.sellerId ? report.sellerId?.lastName : ""}
                          </div>
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {report.createdAt}
                          </div>
                          <button
                            onClick={() => handleToggleResolved(report._id)}
                            className={`flex items-center ${
                              report.isResolved
                                ? "text-green-600 hover:text-green-800"
                                : "text-yellow-600 hover:text-yellow-800"
                            }`}
                          >
                            {report.isResolved ? (
                              <>
                                <CheckCircle size={12} className="mr-1" />
                                Resuelto
                              </>
                            ) : (
                              <>
                                <XCircle size={12} className="mr-1" />
                                Pendiente
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario de Reporte */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-700 flex items-center mb-6">
              <AlertTriangle className="mr-2 text-blue-500" size={20} />
              Nuevo Reporte
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="sellerId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vendedor
                </label>
                <select
                  id="sellerId"
                  name="sellerId"
                  value={formData.sellerId ? formData.sellerId._id : ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione un vendedor</option>
                  {Sellers.map((seller, i) => (
                    <option key={i} value={seller._id}>
                      {seller.firstName} {seller.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripción del Problema
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describa el problema o situación que desea reportar..."
                  required
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  disabled={!formData.sellerId || !formData.description.trim()}
                >
                  <Send size={18} className="mr-2" />
                  Enviar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;

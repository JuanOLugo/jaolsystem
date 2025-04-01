"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import {
  DeleteInvoice,
  GetInvoice,
  GetProductInvoice,
  UpdateInvoice,
} from "../../Controllers/Invoice.controllers";
import InvoiceEditModal, { InvoiceItem } from "./InvoiceEditModal";

// Tipo para una venta
export interface Sale {
  _id: string;
  actualizadoEn: string;
  clienteContacto: string;
  clienteNombre: string;
  creadoEn: string;
  creditoActivo: boolean;
  descuentoTotal: number;
  estado: string;
  metodoPago: string;
  saldoPendiente: number;
  total: number;
  usuariocontenedor: string;
  __v: number;
}




const SalesTable: React.FC = () => {
  const [sales, setSales] = useState<Array<Sale>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Sale | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [profit, setProfit] = useState(0);
  const [Fecha, setFecha] = useState(new Date().toLocaleDateString("es-co"));
  const [IsOpen, setIsOpen] = useState(false);
  const [invoiceProducts, setinvoiceProducts] = useState<Array<InvoiceItem>>([])
  // Función para manejar la búsqueda
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Función para manejar el ordenamiento
  const handleSort = (column: keyof Sale) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    GetInvoice(Fecha).then((data) => {
      console.log(data);
      setSales(data.data.facturas);
      setProfit(data.data.totalWin);
    });
    console.log(Fecha);
  }, [Fecha]);

  const [totalSales, settotalSales] = useState(0);

  const handleDeleteInvoice = (invoiceid: string) => {
    console.log(invoiceid);
    DeleteInvoice(invoiceid)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));

    setSales((prev) => prev.filter((s) => s._id !== invoiceid));
    window.location.reload();
  };

  // Filtrar y ordenar ventas
  useEffect(() => {
    if (sales) {
      settotalSales(sales.reduce((sum, sale) => sum + sale.total, 0));
    }
  }, [sales]);

  const OnClose = () => setIsOpen(false);
  const OnSave = (products: InvoiceItem[]) => {
    UpdateInvoice(products).then(data => console.log(data)).catch(err => console.log(err))
    setIsOpen(false);
    window.location.reload();
  }

  useEffect(() => {
    if(invoiceProducts.length > 0){
      setIsOpen(true)
    }
  }, [invoiceProducts])
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <InvoiceEditModal isOpen={IsOpen} onClose={OnClose} onSave={OnSave}  invoiceProducts={invoiceProducts}/>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Tabla de Ventas
        </h1>

        {/* Filtros */}
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar por código de venta..."
              className="w-full p-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-400" size={20} />
            <input
              type="date"
              className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const fechaISO = e.target.value;
                const [year, month, day] = fechaISO.split("-");

                console.log(year, month, day);
                setFecha(`${day}/${parseInt(month)}/${year}`);
              }}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Código", "Comprador", "Total", "Fecha", "Acciones"].map(
                  (header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() =>
                        handleSort(header.toLowerCase() as keyof Sale)
                      }
                    >
                      <div className="flex items-center">
                        {header}
                        {sortColumn === header.toLowerCase() &&
                          (sortDirection === "asc" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          ))}
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!sales ? (
                <h1>cargando</h1>
              ) : (
                sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.clienteNombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${sale.total.toLocaleString("es-co")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.creadoEn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={async () => {
                        await GetProductInvoice(sale._id).then((data) => {
                          setinvoiceProducts(data.data.ProductosEnFactura)
                          console.log(data.data.ProductosEnFactura)
                          
                        }).catch((err) => console.log(err));
                        
                      }}>
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(sale._id)}
                        className="text-red-600 cursor-pointer hover:text-red-900"
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

        {/* Totales */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total de Ventas
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                ${totalSales ? totalSales.toLocaleString("es-co") : 0}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total de Ganancias
              </h3>
              <p className="text-2xl font-bold text-green-600">
                ${profit ? profit.toLocaleString("es-co") : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;

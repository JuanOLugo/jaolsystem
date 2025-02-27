"use client"

import type React from "react"
import { useState } from "react"
import { Search, Eye, Trash2, ChevronDown, ChevronUp, Calendar } from "lucide-react"

// Tipo para una venta
type Sale = {
  id: number
  code: string
  seller: string
  buyer: string
  total: number
  profit: number
  date: string
}

// Datos de ejemplo
const initialSales: Sale[] = [
  { id: 1, code: "V001", seller: "Juan Pérez", buyer: "Empresa A", total: 1000, profit: 200, date: "2023-05-15" },
  { id: 2, code: "V002", seller: "María López", buyer: "Empresa B", total: 1500, profit: 300, date: "2023-05-14" },
  { id: 3, code: "V003", seller: "Carlos Gómez", buyer: "Empresa C", total: 2000, profit: 400, date: "2023-05-13" },
  // Añade más ventas aquí...
]

const SalesTable: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof Sale | "">("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Función para manejar la búsqueda
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  // Función para manejar el ordenamiento
  const handleSort = (column: keyof Sale) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filtrar y ordenar ventas
  const filteredAndSortedSales = sales
    .filter(
      (sale) =>
        sale.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!startDate || sale.date >= startDate) &&
        (!endDate || sale.date <= endDate),
    )
    .sort((a, b) => {
      if (!sortColumn) return 0
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  // Calcular totales
  const totalSales = filteredAndSortedSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalProfit = filteredAndSortedSales.reduce((sum, sale) => sum + sale.profit, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tabla de Ventas</h1>

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
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-400" size={20} />
            <input
              type="date"
              className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>a</span>
            <input
              type="date"
              className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Código", "Vendedor", "Comprador", "Total", "Fecha", "Acciones"].map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(header.toLowerCase() as keyof Sale)}
                  >
                    <div className="flex items-center">
                      {header}
                      {sortColumn === header.toLowerCase() &&
                        (sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.seller}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.buyer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Eye size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Ventas</h3>
              <p className="text-2xl font-bold text-blue-600">${totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Ganancias</h3>
              <p className="text-2xl font-bold text-green-600">${totalProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesTable


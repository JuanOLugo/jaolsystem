import type React from "react"
import { useState } from "react"
import { Search, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"

// Tipo para un producto
type Product = {
  id: number
  code: string
  name: string
  salePrice: number
  costPrice: number
  provider: string
  stock: number
  lastUpdated: string
}

// Datos de ejemplo
const initialProducts: Product[] = [
  {
    id: 1,
    code: "P001",
    name: "Producto 1",
    salePrice: 100,
    costPrice: 80,
    provider: "Proveedor A",
    stock: 50,
    lastUpdated: "2023-05-15",
  },
  {
    id: 2,
    code: "P002",
    name: "Producto 2",
    salePrice: 150,
    costPrice: 120,
    provider: "Proveedor B",
    stock: 30,
    lastUpdated: "2023-05-14",
  },
  {
    id: 3,
    code: "P003",
    name: "Producto 3",
    salePrice: 200,
    costPrice: 160,
    provider: "Proveedor C",
    stock: 20,
    lastUpdated: "2023-05-13",
  },
  // Añade más productos aquí...
]

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof Product | "">("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Función para manejar la búsqueda
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  // Función para manejar el ordenamiento
  const handleSort = (column: keyof Product) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = products
    .filter(
      (product) =>
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortColumn) return 0
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Tabla de Productos</h1>

        {/* Buscador */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            className="w-full p-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Código",
                  "Nombre",
                  "Precio Venta",
                  "Precio Costo",
                  "Proveedor",
                  "Stock",
                  "Última Actualización",
                  "Acciones",
                ].map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(header.toLowerCase().replace(" ", "") as keyof Product)}
                  >
                    <div className="flex items-center">
                      {header}
                      {sortColumn === header.toLowerCase().replace(" ", "") &&
                        (sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.salePrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.costPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.provider}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.lastUpdated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit size={18} />
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
      </div>
    </div>
  )
}

export default ProductTable


import type React from "react"
import { useState } from "react"
import { Plus, X, DollarSign, Percent, Package, Hash, Save } from "lucide-react"

type Product = {
  id: string
  code: string
  name: string
  price: number
  discount: number
  quantity: number
}

const Invoicing: React.FC = () => {
  const [formData, setFormData] = useState<Product>({
    id: "",
    code: "",
    name: "",
    price: 0,
    discount: 0,
    quantity: 1,
  })

  const [products, setProducts] = useState<Product[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "discount" || name === "quantity" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.code && formData.name && formData.price > 0 && formData.quantity > 0) {
      setProducts((prev) => [...prev, { ...formData, id: Date.now().toString() }])
      setFormData({
        id: "",
        code: "",
        name: "",
        price: 0,
        discount: 0,
        quantity: 1,
      })
    }
  }

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const discountedPrice = product.price * (1 - product.discount / 100)
      return total + discountedPrice * product.quantity
    }, 0)
  }

  const handleSaveInvoice = () => {
    // Aquí iría la lógica para guardar la factura
    console.log("Guardando factura:", products)
    // Resetear el estado después de guardar
    setProducts([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Nueva Venta</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Agregar Producto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Código
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Código del producto"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del producto"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio de Venta
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Precio de venta"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                  Descuento (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descuento"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cantidad"
                    min="1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <Plus size={18} className="mr-2" />
                Agregar Producto
              </button>
            </form>
          </div>

          {/* Lista de Productos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Productos Agregados</h2>
            <div className="max-h-96 overflow-y-auto mb-4">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay productos agregados</p>
              ) : (
                <ul className="space-y-3">
                  {products.map((product) => (
                    <li key={product.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          Código: {product.code} | Cantidad: {product.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Precio: ${product.price.toFixed(2)} | Descuento: {product.discount}%
                        </p>
                      </div>
                      <button onClick={() => removeProduct(product.id)} className="text-red-500 hover:text-red-700">
                        <X size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700">Total de la Venta</h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">${calculateTotal().toFixed(2)}</p>
              <button
                onClick={handleSaveInvoice}
                disabled={products.length === 0}
                className={`w-full ${
                  products.length > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"
                } text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
              >
                <Save size={18} className="mr-2" />
                Guardar Factura
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoicing


import { DollarSign, User } from "lucide-react"

export function Userinfo() {
    const recentSales = [
      { buyer: "Silfri", quantity: 5, total: 320000 },
      { buyer: "caca", quantity: 5, total: 220000 },
    ]
  
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500 rounded-full">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Username</h3>
            <p className="text-sm text-gray-500">Rol: Admin</p>
          </div>
        </div>
  
        <div>
          <h4 className="font-medium text-gray-700 mb-4">Ventas recientes:</h4>
          <div className="space-y-3">
            {recentSales.map((sale, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4 transition-all hover:bg-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Comprador: {sale.buyer}</span>
                  <DollarSign size={18} className="text-blue-500" />
                </div>
                <div className="text-sm text-gray-600">
                  Cantidad: {sale.quantity} | Total: ${sale.total.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
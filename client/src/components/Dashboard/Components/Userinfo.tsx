import { DollarSign, User } from "lucide-react";
import { Sale } from "../../Sales/Sales-table";

interface IRecentSales {
  buyer: string;
  quantity: number;
  total: number;
}

interface IUserBasic {
  nombreusuario: string;
  rol: string;
}

export function Userinfo({Sales, Usern} : {Sales: Array<Sale> | [], Usern: IUserBasic }) {

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500 rounded-full">
          <User size={24} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{Usern.nombreusuario}</h3>
          <p className="text-sm text-gray-500">Rol: {Usern.rol}</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-4">Ventas recientes:</h4>
        <div className="space-y-3">
          {Sales.length == 0 ? (
            <div>
              <h3 className="font-semibold text-lg">No hay ventas hoy</h3>
            </div>
          ) : (
            Sales.map((sale, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-lg p-4 transition-all hover:bg-blue-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Comprador: {sale.clienteNombre}</span>
                  <DollarSign size={18} className="text-blue-500" />
                </div>
                <div className="text-sm text-gray-600">
                  Estado: {sale.estado} | Total: $
                  {sale.total.toLocaleString("es-co")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

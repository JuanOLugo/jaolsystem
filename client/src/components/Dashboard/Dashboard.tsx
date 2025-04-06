import { Calendar, FileText, HandCoins, Package } from "lucide-react";
import { Information } from "./Components/Information";
import { SellsPerMonth } from "./Components/SellsPerMonth";
import { Userinfo } from "./Components/Userinfo";
import { useEffect, useState } from "react";
import {
  GetDashBoardInfo,
  GetUserInfo,
} from "../../Controllers/User.controllers";
import { Sale } from "../Sales/Sales-table";

export interface VentasPorMes {
  mes: number;
  total: number;
}

interface DatosVentas {
  VentasPorMes: VentasPorMes[];
  facturas: number;
  productosMesActual: number;
  productosMesAnterior: number;
  UltimasDosventas: Sale[]
}

export function Dashboard() {

  const date = new Date().toLocaleDateString("es-co");
  const [UserInfo, setUserInfo] = useState(null);
  const [DashboardData, setDashboardData] = useState<DatosVentas>();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      GetUserInfo({ date })
        .then((data) => {
          const { user } = data.data;
          const { correo, creadoEn, estado, _id, __v, ...resto } = user;
          setUserInfo(resto);
          GetDashBoardInfo(date).then((data) => {
            console.log(data);
            setDashboardData(data.data);
          });
        })
        .catch((err) => console.log(err));
    }
  }, []);

  function calcularPorcentajeCambio(antes: number, ahora: number) {
    if (antes === 0) {
      return ahora > 0 ? "+100" : "Sin cambio";
    }
    return ((ahora - antes) / antes) * 100;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      {/* Header */}
      <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-500">Dashboard</h1>
            <p className="text-gray-500 mt-1 flex items-center">
              <Calendar size={16} className="mr-1" />
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Information
          title="Ventas del mes"
          value={
            DashboardData?.VentasPorMes
              ? DashboardData.VentasPorMes[
                  new Date().getMonth()
                ].total.toString()
              : "0"
          }
          icon={<HandCoins size={24} className="text-blue-500" />}
          trend=""
          trendUp={true}
        />
        <Information
          title="Facturas"
          value={DashboardData?.facturas.toString() ?? "0"}
          icon={<FileText size={24} className="text-blue-500" />}
          trend=""
          trendUp={true}
        />
        <Information
          title="Productos"
          value={DashboardData?.productosMesActual.toString() ?? "0"}
          icon={<Package size={24} className="text-blue-500" />}
          trend={
            DashboardData
              ? calcularPorcentajeCambio(
                  DashboardData?.productosMesAnterior ?? 0,
                  DashboardData?.productosMesActual ?? 0
                ).toString() + "%"
              : "0"
          }
          trendUp={true}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <SellsPerMonth dataVentas={DashboardData?.VentasPorMes ?? []} />
        </div>

        {/* User Info Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <Userinfo
            Sales={DashboardData?.UltimasDosventas ? DashboardData?.UltimasDosventas : []}
            Usern={
              UserInfo ?? {
                rol: "Cargando...",
                nombreusuario: "Cargando...",
              }
            }
          />
        </div>
      </div>
    </div>
  );
}

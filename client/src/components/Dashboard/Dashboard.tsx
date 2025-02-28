import { FileText, HandCoins, Package } from "lucide-react";
import { Information } from "./Components/Information";
import { SellsPerMonth } from "./Components/SellsPerMonth";
import { Userinfo } from "./Components/Userinfo";
import { useEffect, useState } from "react";
import { GetUserInfo } from "../../Controllers/User.controllers";


export function Dashboard() {
  //Obtener cantidad de productos vendidos

  //obtener cantidad de facturas

  //obtener cantidad de productos

  //obtener array de ventas por mes

  // obtener user info
  const date = new Date().toLocaleDateString("es-co")
  const [UserInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if(localStorage.getItem("user")){
      GetUserInfo({date}).then(data => {
        const {user} =data.data
        const {correo, creadoEn, estado, _id, __v, ...resto} = user
        setUserInfo(resto)
      }).catch(err => console.log(err))
    }
  }, [])
  


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-500">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Information
          title="Ventas"
          value="123"
          icon={<HandCoins size={24} className="text-blue-500" />}
          trend="+12.5%"
          trendUp={true}
        />
        <Information
          title="Facturas"
          value="123"
          icon={<FileText size={24} className="text-blue-500" />}
          trend="+5.2%"
          trendUp={true}
        />
        <Information
          title="Productos"
          value="123"
          icon={<Package size={24} className="text-blue-500" />}
          trend="-2.1%"
          trendUp={false}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <SellsPerMonth />
        </div>

        {/* User Info Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <Userinfo Sales={[]} Usern={UserInfo ?? {
            rol: "Cargando...",
            nombreusuario: "Cargando..."
          }} />
        </div>
      </div>
    </div>
  ); 
}

"use client";

import { User, Mail, Users, Key, Edit, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ChangeBasicUserInfo, GetChangeThingCode, GetUserInfo, IUserinfo } from "../../../Controllers/User.controllers";
import VerificationChangeModal from "./VerificationChangeModal";

interface IUserBasicInfo {
  correo: string;
  creadoEn: string;
  estado: boolean;
  nombreusuario: string;
  rol: string;
  _id: string;
}


function UserSession() {
  const [IsOpen, setIsOpen] = useState(false)
  const [UserInfo, setUserInfo] = useState<IUserBasicInfo>()
  const [TypeChange, setTypeChange] = useState<
    "contraseña" | "correo" | "nombreusuario"
  >("contraseña");
  useEffect(() => {
    GetUserInfo({date: "1/1/2025"}).then(data => setUserInfo(data.data.user))
  }, [])
  const HandleChangeThing = (thing: string) => {
    setTypeChange(thing as "contraseña" | "correo" | "nombreusuario");
    setIsOpen(true)

    //enviamos peticion para obtener el codigo de verificacion
    GetChangeThingCode().then(res => console.log(res)).catch(err => console.log(err));
  };

  const HandleComplete = async(data: {type: string, value: string}) => {
    await ChangeBasicUserInfo(data).then(res => window.location.reload())
    setIsOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <VerificationChangeModal
        changeType={TypeChange}
        email={UserInfo?.correo ? UserInfo?.correo : "No disponible"}
        isOpen={IsOpen}
        onClose={() => setIsOpen(false)}
        onComplete={HandleComplete}
      />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          Configuración de Usuario
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel de Información */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Información Personal
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <User className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium text-gray-800">{UserInfo?.nombreusuario ? UserInfo?.nombreusuario : "No disponible"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <Mail className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{UserInfo?.correo ? UserInfo?.correo : "No disponible"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <Users className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Rol de usuario</p>
                  <p className="font-medium text-gray-800">{UserInfo?.rol ? UserInfo?.rol.charAt(0).toUpperCase() + UserInfo?.rol.slice(1) : "No disponible"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Configuración */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Configuración de Cuenta
            </h2>

            <div className="space-y-3">
              {/* Cambiar Contraseña */}
              <button
                onClick={() => HandleChangeThing("contraseña")}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Key className="text-blue-500" size={20} />
                  <span className="font-medium text-gray-700">
                    Cambiar Contraseña
                  </span>
                </div>
                <ChevronRight
                  className="text-blue-500 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>

              {/* Cambiar Email */}
              <button
                onClick={() => HandleChangeThing("correo")}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="text-blue-500" size={20} />
                  <span className="font-medium text-gray-700">
                    Cambiar Email
                  </span>
                </div>
                <ChevronRight
                  className="text-blue-500 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>

              {/* Cambiar Nombre de Usuario */}
              <button
                onClick={() => HandleChangeThing("nombreusuario")}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Edit className="text-blue-500" size={20} />
                  <span className="font-medium text-gray-700">
                    Cambiar Nombre de usuario
                  </span>
                </div>
                <ChevronRight
                  className="text-blue-500 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>
            </div>

            {/* Nota informativa */}
            <p className="mt-6 text-sm text-gray-500 text-center">
              Los cambios pueden tardar unos minutos en reflejarse en el sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSession;

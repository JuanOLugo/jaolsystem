"use client"

import { User, Mail, Users, Key, Edit, ChevronRight } from "lucide-react"
import { useState } from "react"

function UserSession() {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [showChangeUsername, setShowChangeUsername] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Configuración de Usuario</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel de Información */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Información Personal</h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <User className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium text-gray-800">Juan</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <Mail className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">Juan@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                <Users className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Usuarios en tienda</p>
                  <p className="font-medium text-gray-800">Juan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Configuración */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Configuración de Cuenta</h2>

            <div className="space-y-3">
              {/* Cambiar Contraseña */}
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Key className="text-blue-500" size={20} />
                  <span className="font-medium text-gray-700">Cambiar Contraseña</span>
                </div>
                <ChevronRight className="text-blue-500 group-hover:translate-x-1 transition-transform" size={20} />
              </button>

              {/* Cambiar Email */}
              <button
                onClick={() => setShowChangeEmail(!showChangeEmail)}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="text-blue-500" size={20} />
                  <span className="font-medium text-gray-700">Cambiar Email</span>
                </div>
                <ChevronRight className="text-blue-500 group-hover:translate-x-1 transition-transform" size={20} />
              </button>

              {/* Cambiar Nombre de Usuario */}
              <button
                onClick={() => setShowChangeUsername(!showChangeUsername)}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Edit className="text-blue-500" size={20} />
                  <span className="font-medium text-gray-700">Cambiar Nombre de usuario</span>
                </div>
                <ChevronRight className="text-blue-500 group-hover:translate-x-1 transition-transform" size={20} />
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
  )
}

export default UserSession


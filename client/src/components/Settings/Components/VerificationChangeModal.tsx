"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  X,
  ArrowRight,
  Key,
  User,
  Mail,
  Lock,
  CheckCircle,
  ArrowLeft,
  Shield,
} from "lucide-react";
import {
  VerifyCode,
} from "../../../Controllers/User.controllers";

type ChangeType = "contraseña" | "correo" | "nombreusuario";

interface VerificationChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { type: ChangeType; value: string }) => void;
  changeType: ChangeType;
  email: string;
}

const VerificationChangeModal: React.FC<VerificationChangeModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  changeType,
  email,
}) => {
  // Estados para manejar las etapas del modal
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [newValue, setNewValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changeError, setChangeError] = useState("");

  useEffect(() => {
    console.log(changeType)
  }, [changeType])

  // Resetear estados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setVerificationCode("");
      setNewValue("");
      setConfirmValue("");
      setVerificationError("");
      setChangeError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Manejar verificación del código
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationError("");

    try {
      // Simulación de verificación (reemplazar con llamada real a API)
      await VerifyCode(verificationCode);

      // Para demostración, consideramos válido cualquier código de 6 dígitos
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        setCurrentStep(2);
      } else {
        setVerificationError(
          "Código de verificación inválido. Por favor, intente nuevamente."
        );
      }
    } catch (error) {
      setVerificationError(
        "Error al verificar el código. Por favor, intente nuevamente."
      );
    } finally {
      setIsVerifying(false);
    }
  };
 
  

  // Manejar envío del formulario de cambio
  const handleSubmitChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setChangeError("");

    try {
      // Validaciones según el tipo de cambio
      if (changeType === "contraseña") {
        if (newValue.length < 8) {
          throw new Error("La contraseña debe tener al menos 8 caracteres.");
        }
        if (newValue !== confirmValue) {
          throw new Error("Las contraseñas no coinciden.");
        }
       
      } else if (changeType === "correo") {
        if (!/\S+@\S+\.\S+/.test(newValue)) {
          throw new Error("Por favor, ingrese un correo electrónico válido.");
        }
        if (newValue !== confirmValue) {
          throw new Error("Los correos electrónicos no coinciden.");
        }
      } else if (changeType === "nombreusuario") {
        if (newValue.length < 3) {
          throw new Error(
            "El nombre de usuario debe tener al menos 3 caracteres."
          );
        }
      }

    
      // Completar el proceso
      onComplete({ type: changeType, value: newValue });
    } catch (error) {
      if (error instanceof Error) {
        setChangeError(error.message);
      } else {
        setChangeError(
          "Error al procesar su solicitud. Por favor, intente nuevamente."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener título y campos según el tipo de cambio
  const getChangeTypeInfo = () => {
    switch (changeType) {
      case "contraseña":
        return {
          title: "Cambiar Contraseña",
          icon: <Lock className="mr-2 text-blue-500" size={20} />,
          fields: (
            <>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    id="newPassword"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingrese su nueva contraseña"
                    required
                    minLength={8}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Mínimo 8 caracteres
                </p>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmValue}
                    onChange={(e) => setConfirmValue(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirme su nueva contraseña"
                    required
                  />
                </div>
              </div>
            </>
          ),
        };
      case "nombreusuario":
        return {
          title: "Cambiar Nombre de Usuario",
          icon: <User className="mr-2 text-blue-500" size={20} />,
          fields: (
            <div>
              <label
                htmlFor="newUsername"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nuevo Nombre de Usuario
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  id="newUsername"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese su nuevo nombre de usuario"
                  required
                  minLength={3}
                />
              </div>
            </div>
          ),
        };
      case "correo":
        return {
          title: "Cambiar Correo Electrónico",
          icon: <Mail className="mr-2 text-blue-500" size={20} />,
          fields: (
            <>
              <div>
                <label
                  htmlFor="newEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nuevo Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="correo"
                    id="newEmail"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingrese su nuevo correo electrónico"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirmar Correo Electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="correo"
                    id="confirmEmail"
                    value={confirmValue}
                    onChange={(e) => setConfirmValue(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirme su nuevo correo electrónico"
                    required
                  />
                </div>
              </div>
            </>
          ),
        };
      default:
        return {
          title: "Cambiar Información",
          icon: <User className="mr-2 text-blue-500" size={20} />,
          fields: null,
        };
    }
  };

  const changeTypeInfo = getChangeTypeInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            {currentStep === 1 ? (
              <>
                <Shield className="mr-2 text-blue-500" size={20} />
                Verificación de Seguridad
              </>
            ) : (
              <>
                {changeTypeInfo.icon}
                {changeTypeInfo.title}
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {currentStep === 1 ? (
            // Paso 1: Verificación de código
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  Hemos enviado un código de verificación a{" "}
                  <strong>{email}</strong>. Por favor, ingrese el código para
                  continuar.
                </p>
              </div>

              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Código de Verificación
                </label>
                <div className="relative">
                  <Key
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
                    placeholder="Ingrese el código de 6 dígitos"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>
                {verificationError && (
                  <p className="mt-2 text-sm text-red-600">
                    {verificationError}
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  disabled={isVerifying || verificationCode.length !== 6}
                >
                  {isVerifying ? "Verificando..." : "Verificar"}
                  {!isVerifying && <ArrowRight size={18} className="ml-2" />}
                </button>
              </div>
            </form>
          ) : (
            // Paso 2: Formulario de cambio
            <form onSubmit={handleSubmitChange} className="space-y-4">
              {changeTypeInfo.fields}

              {changeError && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-700">{changeError}</p>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Volver
                </button>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    disabled={
                      isSubmitting ||
                      !newValue ||
                      (changeType !== "nombreusuario" && !confirmValue)
                    }
                  >
                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    {!isSubmitting && (
                      <CheckCircle size={18} className="ml-2" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationChangeModal;

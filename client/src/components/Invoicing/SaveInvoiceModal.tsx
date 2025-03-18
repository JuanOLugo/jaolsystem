"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  X,
  Save,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  CreditCard,
} from "lucide-react";

interface InvoicePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: {
    amountPaid: number;
    change: number;
    paymentMethod: string;
    transactionId: string | undefined;
  }) => void;
  totalAmount: number;
}

type PaymentMethod = "cash" | "nequi";

const SaveInvoiceModal: React.FC<InvoicePaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  totalAmount,
}) => {
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<
    "exact" | "change" | "insufficient"
  >("exact");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [transactionId, setTransactionId] = useState<string>("");

  useEffect(() => {
    // Calcular el cambio y determinar el estado del pago
    if (typeof amountPaid === "number") {
      const calculatedChange =
        paymentMethod === "cash" ? amountPaid - totalAmount : 0;
      setChange(calculatedChange);

      if (calculatedChange > 0) {
        setPaymentStatus("change");
      } else if (calculatedChange === 0) {
        setPaymentStatus("exact");
      } else {
        setPaymentStatus("insufficient");
      }
    }
  }, [amountPaid, totalAmount, paymentMethod]);

  // Resetear valores cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setAmountPaid(0);
      setPaymentMethod("cash");
      setTransactionId("");
    }
  }, [isOpen, totalAmount]);

  if (!isOpen) return null;

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;
    setAmountPaid(value);
  };

  const handleTransactionIdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTransactionId(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof amountPaid !== "number") return;
    // Validar según el método de pago
    if (paymentMethod === "cash" && amountPaid < totalAmount) {
      return; // No permitir guardar si el efectivo es insuficiente
    }

    if (paymentMethod === "nequi" && !transactionId) {
      return; // No permitir guardar si no hay ID de transacción para Nequi
    }

    onSave({
      amountPaid: paymentMethod === "cash" ? amountPaid : totalAmount,
      change,
      paymentMethod,
      transactionId: paymentMethod === "nequi" ? transactionId : undefined,
    });

    setChange(0);
    setAmountPaid(0);
  };

  // Determinar colores y mensajes según el estado del pago (solo para efectivo)
  const getStatusConfig = () => {
    if (paymentMethod === "nequi") {
      return {
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        icon: <Smartphone className="text-purple-500" size={24} />,
        message: "Pago con Nequi",
      };
    }

    switch (paymentStatus) {
      case "change":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          icon: <CheckCircle className="text-green-500" size={24} />,
          message: "Devolver al cliente",
        };
      case "exact":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-700",
          icon: <CheckCircle className="text-yellow-500" size={24} />,
          message: "Cantidad exacta",
        };
      case "insufficient":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-700",
          icon: <AlertTriangle className="text-red-500" size={24} />,
          message: "Falta dinero",
        };
      default:
        return {
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
          icon: null,
          message: "",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Finalizar Venta
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Total de la factura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total a Pagar
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  value={totalAmount.toLocaleString("es-co")}
                  className="w-full pl-10 pr-3 py-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none text-lg font-bold"
                  readOnly
                />
              </div>
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Método de Pago
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center justify-center p-4 rounded-lg border transition-colors ${
                    paymentMethod === "cash"
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <DollarSign
                    size={20}
                    className={
                      paymentMethod === "cash"
                        ? "text-blue-500 mr-2"
                        : "text-gray-500 mr-2"
                    }
                  />
                  <span className="font-medium">Efectivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("nequi")}
                  className={`flex items-center justify-center p-4 rounded-lg border transition-colors ${
                    paymentMethod === "nequi"
                      ? "bg-purple-50 border-purple-300 text-purple-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Smartphone
                    size={20}
                    className={
                      paymentMethod === "nequi"
                        ? "text-purple-500 mr-2"
                        : "text-gray-500 mr-2"
                    }
                  />
                  <span className="font-medium">Nequi</span>
                </button>
              </div>
            </div>

            {/* Campos específicos según el método de pago */}
            {paymentMethod === "cash" ? (
              <>
                {/* Dinero recibido (solo para efectivo) */}
                <div>
                  <label
                    htmlFor="amountPaid"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dinero Recibido
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                    <input
                      type="number"
                      id="amountPaid"
                      value={amountPaid}
                      onChange={handleAmountPaidChange}
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      min="0"
                      step="0.01"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Cambio / Vuelto (solo para efectivo) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cambio
                  </label>
                  <div
                    className={`relative p-4 rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {statusConfig.icon}
                        <span
                          className={`ml-2 ${statusConfig.textColor} font-medium`}
                        >
                          {statusConfig.message}
                        </span>
                      </div>
                      <span
                        className={`text-xl font-bold ${statusConfig.textColor}`}
                      >
                        ${Math.max(0, change).toLocaleString("es-co")}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ID de transacción (solo para Nequi) */}
                <div>
                  <label
                    htmlFor="transactionId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ID de Transacción Nequi
                  </label>
                  <div className="relative">
                    <CreditCard
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                    <input
                      type="text"
                      id="transactionId"
                      value={transactionId}
                      onChange={handleTransactionIdChange}
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                      placeholder="Ingrese el ID de la transacción"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Mensaje de confirmación (solo para Nequi) */}
                <div
                  className={`p-4 rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor}`}
                >
                  <div className="flex items-center">
                    {statusConfig.icon}
                    <div className="ml-3">
                      <p className={`${statusConfig.textColor} font-medium`}>
                        Confirme que el pago ha sido recibido
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Verifique que la transacción se haya completado
                        correctamente antes de finalizar la venta.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Botones de acción */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                (paymentMethod === "cash" && amountPaid < totalAmount) ||
                (paymentMethod === "nequi" && !transactionId)
              }
              className={`px-4 py-2 rounded-lg text-white flex items-center transition-colors ${
                (paymentMethod === "cash" && amountPaid < totalAmount) ||
                (paymentMethod === "nequi" && !transactionId)
                  ? "bg-gray-400 cursor-not-allowed"
                  : paymentMethod === "nequi"
                  ? "bg-purple-500 hover:bg-purple-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              <Save size={18} className="mr-2" />
              Guardar Factura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveInvoiceModal;

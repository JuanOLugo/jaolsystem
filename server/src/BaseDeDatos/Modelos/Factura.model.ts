import mongoose, { Schema, model } from "mongoose";

type FechaTipo = `${string}-${string}-${string}`;

// Interfaz de la factura
interface IFactura {
  clienteNombre: string;
  vendedorId: mongoose.Schema.Types.ObjectId,
  clienteContacto: string;
  total: number;
  descuentoTotal: number;
  metodoPago: string;
  estado: string;
  creditoActivo: boolean;
  saldoPendiente: number;
  creadoEn: FechaTipo;
  actualizadoEn: FechaTipo;
  usuariocontenedor: mongoose.Schema.Types.ObjectId;
}

// Schema de la factura para la base de datos
const SchemaFactura = new Schema<IFactura>({
  clienteNombre: { type: String, required: true },
  vendedorId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Vendedor"},
  clienteContacto: { type: String, required: true },
  total: { type: Number, required: true },
  descuentoTotal: { type: Number, required: true },
  metodoPago: { type: String, required: true },
  estado: { type: String, required: true },
  creditoActivo: { type: Boolean, required: true },
  saldoPendiente: { type: Number, required: true },
  creadoEn: { type: String, required: true },
  actualizadoEn: { type: String, required: true },
  usuariocontenedor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }
});

export default model("Invoice", SchemaFactura);

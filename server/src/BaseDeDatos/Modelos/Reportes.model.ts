import mongoose, { Schema, model } from "mongoose";

export interface IReport {
  sellerId: string;
  sellerName: string;
  description: string;
  createdAt: string;
  isResolved: boolean;
  usuarioContenedor: mongoose.Schema.Types.ObjectId;
}


// Schema del producto en factura
const SchemaReportes = new Schema<IReport>({
  sellerId: { type: String, required: true, ref: "Vendedor" },
  description: { type: String, required: true },
  createdAt: { type: String, required: true },
  isResolved: { type: Boolean, required: true },
  usuarioContenedor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

export default model("Reportes", SchemaReportes);



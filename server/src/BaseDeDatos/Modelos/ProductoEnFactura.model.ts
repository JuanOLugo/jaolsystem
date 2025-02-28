import mongoose, { Schema, model } from "mongoose";

type FechaTipo = `${string}-${string}-${string}`;

// Interfaz del producto en factura
export interface IProductoEnFactura {
  productoId: mongoose.Schema.Types.ObjectId;
  cantidad: number;
  precioCosto: number;
  precioVenta: number;
  descuento: number;
  facturacontenedora: mongoose.Schema.Types.ObjectId;
  creadoEn: FechaTipo;
}
// Schema del producto en factura
const SchemaProductoEnFactura = new Schema<IProductoEnFactura>({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  cantidad: { type: Number, required: true },
  precioCosto: { type: Number, required: true },
  precioVenta: { type: Number, required: true },
  descuento: { type: Number, required: true },
  facturacontenedora: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Invoice",
  },
  creadoEn: {type: String, required: true }
  
});

export default model("ProductInvoice", SchemaProductoEnFactura);

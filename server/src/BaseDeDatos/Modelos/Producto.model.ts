import mongoose, { Schema, model } from "mongoose";

type FechaTipo = `${string}-${string}-${string}`;

// Interfaz del producto
interface IProducto {
  nombre: string;
  //descripcion: string;
  precioDeCosto: number;
  precioDeVenta: number;
  stock: number;
  codigoBarra: string;
  proveedorNombre: string;
  creadoEn: FechaTipo;
  actualizadoEn: FechaTipo;
  usuariocontenedor: mongoose.Schema.Types.ObjectId;
}
// Schema del producto
const SchemaProducto = new Schema<IProducto>({
  nombre: { type: String, required: true },
  //descripcion: { type: String, required: true },
  precioDeCosto: { type: Number, required: true },
  precioDeVenta: { type: Number, required: true },
  stock: { type: Number, required: true },
  codigoBarra: { type: String, required: true },
  proveedorNombre: { type: String, required: true },
  creadoEn: { type: String, required: true },
  actualizadoEn: { type: String, required: true },
  usuariocontenedor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }
});

export default model("Product", SchemaProducto);

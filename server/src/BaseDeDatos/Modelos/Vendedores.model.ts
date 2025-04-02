import mongoose, { Schema, model } from "mongoose";

type FechaTipo = `${string}-${string}-${string}`;

// Interfaz del producto
interface IVendedor {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    createdAt: string,
    usuarioContenedor: mongoose.Schema.Types.ObjectId,
}
// Schema del producto
const SchemaVendedor = new Schema<IVendedor>({
    firstName: {type: String, required: true },
    lastName: {type: String, required: true },
    email: {type: String, required: true },
    phone: {type: String, required: true },
    createdAt: {type: String, required: true },
    usuarioContenedor: {type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }
});

export default model("Vendedor", SchemaVendedor);

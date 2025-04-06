import { Schema, model } from "mongoose";

type FechaTipo = `${string}-${string}-${string}`;

// Interfaz del usuario
interface IUsuario {
  nombreusuario: string;
  correo: string;
  contraseña: string;
  rol: "admin" | "usuario";
  estado: boolean;
  creadoEn: FechaTipo;
}

// Schema del usuario
const SchemaUsuario = new Schema<IUsuario>({
  nombreusuario: { type: String, required: true },
  contraseña: { type: String, required: true, select: false },
  correo: { type: String, required: true, unique: true },
  creadoEn: { type: String, required: true },
  estado: { type: Boolean, required: true },
  rol: { type: String, required: true },
});


export default model("User", SchemaUsuario)
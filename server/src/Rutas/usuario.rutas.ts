import { Router } from "express";
import { InicioSesionUsuario, RegistrarUsuario } from "../middlewares/usuario.m";
const usuarioRutas = Router();

usuarioRutas.post("/login", InicioSesionUsuario)
usuarioRutas.post("/register", RegistrarUsuario)

export default usuarioRutas
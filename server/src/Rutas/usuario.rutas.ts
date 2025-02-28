import { Router } from "express";
import { InicioSesionUsuario, RegistrarUsuario, UserBasic } from "../middlewares/usuario.m";
import { PassportStrategy } from "../Autentificacion/Passport.config";
import passport from "passport";
const usuarioRutas = Router();

usuarioRutas.post("/login", InicioSesionUsuario)
usuarioRutas.post("/register", RegistrarUsuario)
usuarioRutas.post("/userbasic", PassportStrategy.authenticate("jwt", {session: false}) , UserBasic)

export default usuarioRutas
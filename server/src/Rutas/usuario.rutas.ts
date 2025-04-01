import { Router } from "express";
import {
  GetTotalDashboard,
  InicioSesionUsuario,
  RegistrarUsuario,
  UserBasic,
} from "../middlewares/usuario.m";
import { PassportStrategy } from "../Autentificacion/Passport.config";
import passport from "passport";
const usuarioRutas = Router();

usuarioRutas.post("/login", InicioSesionUsuario);
usuarioRutas.post("/register", RegistrarUsuario);
usuarioRutas.post(
  "/userbasic",
  PassportStrategy.authenticate("jwt", { session: false }),
  UserBasic
);
usuarioRutas.post(
  "/dashboardinfo",
  PassportStrategy.authenticate("jwt", { session: false }),
  GetTotalDashboard
);

export default usuarioRutas;

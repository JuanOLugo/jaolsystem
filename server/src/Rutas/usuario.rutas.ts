import { Router } from "express";
import {
  CambiarDatosBasicos,
  CambiarDatosBasicosDelUsuario,
  GetTotalDashboard,
  InicioSesionUsuario,
  RegistrarUsuario,
  UserBasic,
  VerificarCodigo,
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

usuarioRutas.get(
  "/changedata",
  PassportStrategy.authenticate("jwt", { session: false }),
  CambiarDatosBasicos
);

usuarioRutas.post(
  "/verifycode",
  PassportStrategy.authenticate("jwt", { session: false }),
  VerificarCodigo
);

usuarioRutas.post(
  "/changeuserinfo",
  PassportStrategy.authenticate("jwt", { session: false }),
  CambiarDatosBasicosDelUsuario
);



export default usuarioRutas;

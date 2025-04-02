import { Router } from "express";
import {
  GetTotalDashboard,
  InicioSesionUsuario,
  RegistrarUsuario,
  UserBasic,
} from "../middlewares/usuario.m";
import { PassportStrategy } from "../Autentificacion/Passport.config";
import passport from "passport";
import { CrearVendedor, EditarVendedor, EliminarVendedor, ObtenerVendedor } from "../middlewares/vendedor.m";
const vendedorRutas = Router();

vendedorRutas.post(
  "/create",
  PassportStrategy.authenticate("jwt", { session: false }),
  CrearVendedor
);

vendedorRutas.get(
  "/get",
  PassportStrategy.authenticate("jwt", { session: false }),
  ObtenerVendedor
);

vendedorRutas.post(
  "/delete",
  PassportStrategy.authenticate("jwt", { session: false }),
  EliminarVendedor
);

vendedorRutas.post(
  "/update",
  PassportStrategy.authenticate("jwt", { session: false }),
  EditarVendedor
);


export default vendedorRutas;

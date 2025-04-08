import { Router } from "express";
import {
  GetTotalDashboard,
  InicioSesionUsuario,
  RegistrarUsuario,
  UserBasic,
} from "../middlewares/usuario.m";
import { PassportStrategy } from "../Autentificacion/Passport.config";
import passport from "passport";
import { CrearVendedor, EditarReporte, EditarVendedor, EliminarReporte, EliminarVendedor, ObtenerVendedor } from "../middlewares/vendedor.m";
import { GenerarReporte, ObtenerReportes } from "../middlewares/vendedor.m";
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

vendedorRutas.post(
  "/generatereports",
  PassportStrategy.authenticate("jwt", { session: false }),
  GenerarReporte
);

vendedorRutas.get(
  "/getreports",
  PassportStrategy.authenticate("jwt", { session: false }),
  ObtenerReportes
);

vendedorRutas.post(
  "/editreport",
  PassportStrategy.authenticate("jwt", { session: false }),
  EditarReporte
);

vendedorRutas.post(
  "/deletereport",
  PassportStrategy.authenticate("jwt", { session: false }),
  EliminarReporte
);



export default vendedorRutas;

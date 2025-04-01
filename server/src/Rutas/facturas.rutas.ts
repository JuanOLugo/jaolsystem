import { Router } from "express";

import { PassportStrategy } from "../Autentificacion/Passport.config";
import { ActualizarFacturas, EliminarFacturas, GuardarFatura, ObtenerFacturas, ObtenerProductosDeFacturas } from "../middlewares/factura.m";

const facturasRutas = Router();

facturasRutas.post(
  "/save",
  PassportStrategy.authenticate("jwt", { session: false }),
  GuardarFatura
);

facturasRutas.post(
  "/get",
  PassportStrategy.authenticate("jwt", { session: false }),
  ObtenerFacturas
);

facturasRutas.post(
  "/delete",
  PassportStrategy.authenticate("jwt", { session: false }),
  EliminarFacturas
);


facturasRutas.post(
  "/getProductsInvoice",
  PassportStrategy.authenticate("jwt", { session: false }),
  ObtenerProductosDeFacturas
);

facturasRutas.post(
  "/updateInvoice",
  PassportStrategy.authenticate("jwt", { session: false }),
  ActualizarFacturas
);
export default facturasRutas;

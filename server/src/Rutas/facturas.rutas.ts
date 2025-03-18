import { Router } from "express";

import { PassportStrategy } from "../Autentificacion/Passport.config";
import { GuardarFatura, ObtenerFacturas } from "../middlewares/factura.m";

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
export default facturasRutas;

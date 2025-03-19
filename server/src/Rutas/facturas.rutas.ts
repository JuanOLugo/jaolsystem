import { Router } from "express";

import { PassportStrategy } from "../Autentificacion/Passport.config";
import { EliminarFacturas, GuardarFatura, ObtenerFacturas } from "../middlewares/factura.m";

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
export default facturasRutas;

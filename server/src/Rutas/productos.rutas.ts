import { Router } from "express";
import { CreateCode, CreateProduct } from "../middlewares/producto.m";
import { PassportStrategy } from "../Autentificacion/Passport.config";

const productoRutas = Router();
productoRutas.get(
  "/code",
  PassportStrategy.authenticate("jwt", { session: false }),
  CreateCode
);

productoRutas.post(
  "/create",
  PassportStrategy.authenticate("jwt", { session: false }),
  CreateProduct
);
export default productoRutas;

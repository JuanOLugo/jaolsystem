import { Router } from "express";
import { CreateCode, CreateProduct, DeleteProduct, GetMyProducts} from "../middlewares/producto.m";
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

productoRutas.post(
  "/get",
  PassportStrategy.authenticate("jwt", { session: false }),
  GetMyProducts
);


productoRutas.post(
  "/delete",
  PassportStrategy.authenticate("jwt", { session: false }),
  DeleteProduct
);
export default productoRutas;

import { Router } from "express";
import { CreateCode, CreateProduct, DeleteProduct, FilterProductByCode, GetMyProducts, RegistrarMultiplesProductos, UpdateProduct} from "../middlewares/producto.m";
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

productoRutas.post(
  "/update",
  PassportStrategy.authenticate("jwt", { session: false }),
  UpdateProduct
);

productoRutas.get(
  "/getPbyCode/:code",
  PassportStrategy.authenticate("jwt", { session: false }),
  FilterProductByCode
);

productoRutas.post(
  "/registernewproducts",
  PassportStrategy.authenticate("jwt", { session: false }),
  RegistrarMultiplesProductos
);
export default productoRutas;

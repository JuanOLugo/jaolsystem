import ProductoModel from "../BaseDeDatos/Modelos/Producto.model";
import UsuarioModel from "../BaseDeDatos/Modelos/Usuario.model";
import FacturaModel from "../BaseDeDatos/Modelos/Factura.model";
import { Request, Response, NextFunction } from "express";

export const CreateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { _id } = req.user as { _id: "" };
  const {
    codigo,
    nombre,
    precioCosto,
    precioVenta,
    proveedor,
    antiguedad,
    date,
  } = req.body;

   

};

export const CreateCode = async (req: Request, res: Response): Promise<any> => {
  const { _id } = req.user as { _id: "" };

  const ProductosDeUsuario = await ProductoModel.find({
    usuariocontenedor: _id,
  });

  const numeroUnDigito = 1 + Math.floor(Math.random() * 10);
  let numeroCompleto: string = Math.floor(1000 + Math.random() * 9000) + "";

  const codigoAEnviar = ProductosDeUsuario.filter((p) => {
    if (numeroCompleto == p.codigoBarra) {
      numeroCompleto = Math.floor(1000 + Math.random() * 9000) + "";
    }

    return numeroCompleto;
  });

  res.status(200).send({ codigo: numeroCompleto });
};

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
    date,
  } = req.body;

  try {
    const newProduct = new ProductoModel({
      nombre,
      precioDeCosto: precioCosto,
      precioDeVenta: precioVenta,
      stock: 0,
      codigoBarra: codigo,
      proveedorNombre: proveedor,
      creadoEn: date,
      actualizadoEn: date,
      usuariocontenedor: _id
    });

    await newProduct.save();
    res.status(201).send({ message: "Producto creado" });
  } catch (error) {
    res.status(500).send({ error: "Error al crear el producto" });
    console.log(error);
  }

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


export const GetMyProducts = async (req: Request, res: Response): Promise<any> => {
  const { _id } = req.user as { _id: "" };
  const {cantidad, skip} = req.body;
  if(_id === "") return res.status(400).send({msg: "No auth"})

  try {
    const misProductos = await ProductoModel.find({
      usuariocontenedor: _id,
    });
    res.status(200).send({data: misProductos.slice(skip, skip + 50), length: misProductos.length});
  } catch (error) {
    res.status(500).send({ error: "Error al obtener mis productos" });
    console.log(error);
  }
};

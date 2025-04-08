import ProductoModel from "../BaseDeDatos/Modelos/Producto.model";
import UsuarioModel from "../BaseDeDatos/Modelos/Usuario.model";
import FacturaModel from "../BaseDeDatos/Modelos/Factura.model";
import { Request, Response, NextFunction } from "express";
import { Product } from "./factura.m";

export const CreateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { _id } = req.user as { _id: "" };
  const { codigo, nombre, precioCosto, precioVenta, proveedor, date } =
    req.body;
  if (!_id) return res.status(400).send({ error: "No auth" });
  if (!codigo || !nombre || !precioCosto || !precioVenta || !proveedor || !date)
    return res.status(400).send({ error: "Faltan datos" });

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
      usuariocontenedor: _id,
    });

    await newProduct.save();
    res.status(201).send({ message: "Producto creado" });
  } catch (error) {
    res.status(400).send({ error: "Error al crear el producto" });
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

export const GetMyProducts = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { _id } = req.user as { _id: "" };
  const { skip, filterProduct } = req.body;
  if (_id === "") return res.status(400).send({ msg: "No auth" });

  try {
    const misProductos = await ProductoModel.find({
      usuariocontenedor: _id,
    });

    if (filterProduct.length > 0) {
      const FiltradoAEnviar = misProductos.filter(
        (product) =>
          product.codigoBarra
            .toLowerCase()
            .includes(filterProduct.toLowerCase()) ||
          product.nombre.toLowerCase().includes(filterProduct.toLowerCase())
      );

      res.status(200).send({
        data: FiltradoAEnviar.slice(skip, skip + 50),
        length: FiltradoAEnviar.length,
      });
    } else {
      res.status(200).send({
        data: misProductos.slice(skip, skip + 50),
        length: misProductos.length,
      });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al obtener mis productos" });
    console.log(error);
  }
};

export const DeleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { _id } = req.user as { _id: "" };
  const { ProductId } = req.body;
  if (_id === "") return res.status(400).send({ msg: "No auth" });

  try {
    const misProductos = await ProductoModel.findOneAndDelete({
      usuariocontenedor: _id,
      _id: ProductId,
    });

    res.status(200).send({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).send({ error: "_id i" });
    console.log(error);
  }
};

export const UpdateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const UserId = (req.user as { _id: string })?._id;
  const {
    actualizadoEn,
    nombre,

    precioDeCosto,

    precioDeVenta,

    proveedorNombre,

    stock,

    _id,
  } = req.body;
  if (UserId === "" || !_id) return res.status(400).send({ msg: "No auth" });

  try {
    const productUpdate = await ProductoModel.findByIdAndUpdate(_id, {
      nombre,
      precioDeCosto,
      precioDeVenta,
      proveedorNombre,
      stock,
      actualizadoEn,
    });

    return res.status(200).send({ msg: "Producto actualizado" });
  } catch (error) {
    return res.status(500).send({ error: "Error al actualizar el producto" });
  }
};

export const FilterProductByCode = async (
  req: Request,
  res: Response
): Promise<any> => {
  const UserId = (req.user as { _id: string })?._id;
  const { code } = req.params;
  if (UserId === "" || !code) return res.status(400).send({ msg: "No auth" });

  const BuscarProductoPorCodigo = await ProductoModel.findOne({
    codigoBarra: code,
    usuariocontenedor: UserId,
  });

  if (!BuscarProductoPorCodigo)
    return res.status(404).send({ msg: "Producto no encontrado" });
  res.status(200).send({ data: BuscarProductoPorCodigo });
};

export const RegistrarMultiplesProductos = async (
  req: Request,
  res: Response
): Promise<any> => {
  const UserId = (req.user as { _id: string })?._id;
  const Productos: Product[] = req.body.products;
  if (UserId === "" || !UserId) return res.status(400).send({ msg: "No auth" });

  try {
    const productos = await ProductoModel.find({
      usuariocontenedor: UserId,
      _id: { $in: Productos.map((p) => p._id) },
    });

    for (const productP of Productos) {
      productos.map(async (product) => {
        if (productP._id === product._id.toString()) {
          await ProductoModel.findByIdAndUpdate(product._id, {
            stock: product.stock + productP.stock,
            precioDeCosto: productP.precioDeCosto,
            precioDeVenta: productP.precioDeVenta,
            nombre: productP.nombre,
            codigoBarra: productP.codigoBarra,
            actualizadoEn: productP.actualizadoEn,
          });
        }
      });
    }

    return res.status(200).send({ msg: "Productos registrados" });
  } catch (error) {
    return res.status(500).send({ error: "Error al actualizar el producto" });
  }
};

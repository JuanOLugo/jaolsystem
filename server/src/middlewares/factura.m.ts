import FacturaModel from "../BaseDeDatos/Modelos/Factura.model";
import UsuarioModel from "../BaseDeDatos/Modelos/Usuario.model";
import ProductoModel from "../BaseDeDatos/Modelos/Producto.model";
import { Request, Response, NextFunction } from "express";
import ProductoEnFacturaModel from "../BaseDeDatos/Modelos/ProductoEnFactura.model";
import mongoose from "mongoose";

// Interfaces para los cuerpos solicitados
interface IPaymentData {
  amountPaid: number;
  change: number;
  paymentMethod: string;
  transactionId?: string;
}

interface IProduct {
  id: string;
  code: string;
  name: string;
  realName: string;
  price: number;
  quantity: number;
  discount: number;
  maxQuantity: number;
  priceCost: number;
}
export const GuardarFatura = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Obtener los datos de la factura del cuerpo de la solicitud
  const {
    paymentData,
    products,
  }: { paymentData: IPaymentData; products: IProduct[] } = req.body;
  const IdDeUsuario = (req.user as { _id: string })?._id;
  if (IdDeUsuario.length === 0) return res.status(404);
  // Implementar el codigo para guardar la factura en la base de datos
  const nuevaFactura = new FacturaModel({
    clienteNombre: "Local",
    clienteContacto: "Local",
    total: paymentData.amountPaid - paymentData.change,
    descuentoTotal: products.reduce(
      (acc, product) => acc + product.discount * product.quantity,
      0
    ),
    metodoPago: paymentData.paymentMethod,
    estado: "Pagado",
    creditoActivo: false,
    saldoPendiente: 0,
    creadoEn: new Date().toLocaleDateString("es-co"),
    actualizadoEn: new Date().toLocaleDateString("es-co"),
    usuariocontenedor: IdDeUsuario,
  });

  //Guardar productos en la base de datos
  products.forEach(async (product) => {
    const producto = await ProductoModel.findOne({ codigoBarra: product.code });
    if (producto) {
      producto.stock -= product.quantity;
      await producto.save();
    }
  });
  //guardar factura en la base de datos
  const saveFactura = await nuevaFactura.save();
  //Guardar cada producto de la factura en la db
  products.map(async (product) => {
    const nuevoProducto = new ProductoEnFacturaModel({
      cantidad: product.quantity,
      precioCosto: product.priceCost,
      precioVenta: product.price,
      descuento: product.discount,
      facturacontenedora: saveFactura._id,
      creadoEn: new Date().toLocaleDateString("es-co"),
      productoId: new mongoose.Types.ObjectId(product.id),
    });

    await nuevoProducto.save();
  });
  // Enviar una respuesta de éxito al cliente con el id de la factura

  res.status(201).send({
    message: "Factura guardada correctamente",
    facturaId: saveFactura._id,
  });
};

export const ObtenerFacturas = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Obtener los datos de la factura del cuerpo de la solicitud
  const {
    paymentData,
    products,
  }: { paymentData: IPaymentData; products: IProduct[] } = req.body;
  const IdDeUsuario = (req.user as { _id: string })?._id;
  const { date } = req.body;

  if (IdDeUsuario.length === 0) return res.status(404);
  //Obtener facturas del usaurio
  const facturas = await FacturaModel.find({ usuariocontenedor: IdDeUsuario });

  //Obtener el total ganado en el dia
  const ProductosToday = await ProductoEnFacturaModel.find({ creadoEn: date });
  const totalWin = ProductosToday.reduce((acc, p) => {
    const precioConDescuento = p.precioVenta * (1 - p.descuento / 100);
    const gananciaPorProducto =
      (precioConDescuento - p.precioCosto) * p.cantidad;
    return acc + gananciaPorProducto;
  }, 0);

  res.status(201).send({
    message: "Facturas obtenenidas correctamente",
    facturas,
    totalWin,
  });
};

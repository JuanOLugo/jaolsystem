import FacturaModel from "../BaseDeDatos/Modelos/Factura.model";
import UsuarioModel from "../BaseDeDatos/Modelos/Usuario.model";
import ProductoModel from "../BaseDeDatos/Modelos/Producto.model";
import { Request, Response, NextFunction } from "express";
import ProductoEnFacturaModel from "../BaseDeDatos/Modelos/ProductoEnFactura.model";
import mongoose from "mongoose";

// Interfaces para los cuerpos solicitados
export interface IPaymentData {
  amountPaid: number;
  change: number;
  paymentMethod: string;
  transactionId?: string;
  seller: string;
}

export interface IProduct {
  _id: string;
  codigoBarra: string;
  nombre: string;
  realName: string;
  precioDeVenta: number;
  quantity: number;
  discount: number;
  stock: number;
  precioDeCosto: number;
}

export type Product = {
  _id: string;
  nombre: string;
  precioDeCosto: number;
  precioDeVenta: number;
  stock: number;
  codigoBarra: string;
  proveedorNombre: string;
  creadoEn: string;
  actualizadoEn: string;
  seller: string
};

export interface InvoiceItem {
  _id: string;
  productoId: Product;
  cantidad: number;
  precioCosto: number;
  precioVenta: number;
  descuento: number;
  facturacontenedora: string;
  creadoEn: string;
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
    vendedorId: paymentData.seller.length > 0 ? paymentData.seller : IdDeUsuario,
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
    const producto = await ProductoModel.findOne({ codigoBarra: product.codigoBarra });
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
      precioCosto: product.precioDeCosto,
      precioVenta: product.precioDeVenta,
      descuento: product.discount,
      facturacontenedora: saveFactura._id,
      creadoEn: new Date().toLocaleDateString("es-co"),
      productoId: new mongoose.Types.ObjectId(product._id),
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
  console.log(date);
  if (IdDeUsuario.length === 0) return res.status(404);
  //Obtener facturas del usaurio
  const facturas = await FacturaModel.find({
    usuariocontenedor: IdDeUsuario,
    creadoEn: date,
  }).populate("vendedorId");

  //Obtener el total ganado en el dia
  const ProductosToday = await ProductoEnFacturaModel.find({
    creadoEn: date,
    facturacontenedora: { $in: facturas.map((f) => f._id) },
  });
  if (ProductosToday.length > 0) {
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
  } else {
    res.status(201).send({
      message: "Facturas obtenenidas correctamente",
      facturas,
      totalWin: 0,
    });
  }
};

export const EliminarFacturas = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Obtener los datos de la factura del cuerpo de la solicitud
  const { invoiceId } = req.body;
  const IdDeUsuario = (req.user as { _id: string })?._id;

  if (IdDeUsuario.length === 0) return res.status(404);

  //Obtener facturas del usaurio y eliminar junto a los productos
  try {
    await FacturaModel.findOneAndDelete({ _id: invoiceId });
    const ProductosEnFactura = await ProductoEnFacturaModel.find({
      facturacontenedora: invoiceId,
    });
    ProductosEnFactura.forEach(async (p) => {
      const producto = await ProductoModel.findOne({ _id: p.productoId });
      if (producto) {
        producto.stock += p.cantidad;
        await producto.save();
      }
      await ProductoEnFacturaModel.findOneAndDelete({ _id: p._id });
    });

    res.status(200).send({
      message: "Factura eliminada correctamente",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al eliminar la factura",
    });
  }
};

export const ObtenerProductosDeFacturas = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Obtener los datos de la factura del cuerpo de la solicitud
  const { invoiceId } = req.body;
  const IdDeUsuario = (req.user as { _id: string })?._id;

  if (IdDeUsuario.length === 0 || !invoiceId) return res.status(404);

  //Obtener facturas del usaurio y eliminar junto a los productos
  try {
    const ProductosEnFactura = await ProductoEnFacturaModel.find({
      facturacontenedora: invoiceId,
    }).populate("productoId");
    res.status(200).send({
      message: "Productos obtenidos correctamente",
      ProductosEnFactura,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al obtener la factura",
    });
  }
};

export const ActualizarFacturas = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Obtener los datos de la factura del cuerpo de la solicitud
  const { TotalInvoice } = req.body;
  const IdDeUsuario = (req.user as { _id: string })?._id;

  if (!IdDeUsuario || !TotalInvoice)
    return res.status(404).send("Datos inválidos");

  const facturaContenedora = TotalInvoice[0].facturacontenedora;
  const buscarFactura = await FacturaModel.findById(facturaContenedora);
  if (!buscarFactura) return res.status(404).send("Factura no encontrada");

  const Items = await ProductoEnFacturaModel.find({
    facturacontenedora: facturaContenedora,
  });

  for (const pp of TotalInvoice) {
    const productoExistente = Items.find(
      (p) => p.productoId.toString() === pp.productoId._id
    );

    if (productoExistente) {
      if (pp.cantidad > productoExistente.cantidad) {
        console.log("Aumentando cantidad y reduciendo stock");
        const diferencia = pp.cantidad - productoExistente.cantidad;
        const producto = await ProductoModel.findById(pp.productoId._id);
        if (producto) producto.stock -= diferencia;
        await producto?.save();
      } else if (pp.cantidad < productoExistente.cantidad) {
        console.log("Reduciendo cantidad y aumentando stock");
        const diferencia = productoExistente.cantidad - pp.cantidad;
        const producto = await ProductoModel.findById(pp.productoId._id);
        if (producto) producto.stock += diferencia;
        await producto?.save();
      }

      await ProductoEnFacturaModel.findByIdAndUpdate(productoExistente._id, {
        cantidad: pp.cantidad,
        precioCosto: pp.precioCosto,
        precioVenta: pp.precioVenta,
        descuento: pp.descuento,
        creadoEn: pp.creadoEn,
      });
    } else {
      console.log("Agregando nuevo producto");
      const nuevoProductoEnFactura = new ProductoEnFacturaModel({
        cantidad: pp.cantidad,
        precioCosto: pp.precioCosto,
        precioVenta: pp.precioVenta,
        descuento: pp.descuento,
        facturacontenedora: facturaContenedora,
        creadoEn: pp.creadoEn,
        productoId: pp.productoId._id,
      });
      await nuevoProductoEnFactura.save();
    }
  }

  setTimeout(async () => {
    try {
      const productosEnFactura = await ProductoEnFacturaModel.find({
        facturacontenedora: facturaContenedora,
      });
      const total = productosEnFactura.reduce(
        (acc, p) => acc + p.cantidad * p.precioVenta * (1 - p.descuento / 100),
        0
      );

      await FacturaModel.findByIdAndUpdate(facturaContenedora, {
        total,
        descuentoTotal: TotalInvoice.reduce(
          (acc: any, product: any) =>
            acc + product.descuento * product.cantidad,
          0
        ),
        actualizadoEn: new Date().toLocaleDateString("es-co"),
      });

      res.status(200).send({ message: "Factura actualizada correctamente" });
    } catch (error) {
      res.status(500).send({ message: "Error al actualizar la factura" });
    }
  }, 10);
};

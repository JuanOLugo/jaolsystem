import FacturaModel from "../BaseDeDatos/Modelos/Factura.model";
import ReportesModel, { IReport } from "../BaseDeDatos/Modelos/Reportes.model";
import UsuarioModel from "../BaseDeDatos/Modelos/Usuario.model";
import VendedoresModel from "../BaseDeDatos/Modelos/Vendedores.model";
import { Request, Response, NextFunction } from "express";

interface ISeller {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalSales: number;
  totalAmount: number;
  createdAt: string;
}

type Vendedor = {
  vendedor: ISeller;
  totalDeVentas: number;
  totalDeMonto: number;
};

export const CrearVendedor = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { _id } = req.user as { _id: "" };

  if (!_id) return res.status(400).json({ msg: "No auth" });

  const { firstName, lastName, email, phone, createdAt }: ISeller =
    req.body.seller;
  if (!firstName || !lastName || !email || !phone || !createdAt) {
    return res.status(400).json({ msg: "Faltan datos" });
  }

  const BuscarUsuario = await VendedoresModel.findOne({
    email: email,
    usuarioContenedor: _id,
  });

  if (!BuscarUsuario) {
    const nuevoVendedor = new VendedoresModel({
      firstName,
      lastName,
      email,
      phone,
      totalSales: 0,
      totalAmount: 0,
      createdAt,
      usuarioContenedor: _id,
    });
    try {
      const nuevoVendedorGuardado = await nuevoVendedor.save();
      res.status(200).json({ msg: "Vendedor creado", nuevoVendedorGuardado });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error al crear vendedor" });
    }
  } else res.status(400).json({ msg: "El vendedor ya existe" });
};

export const ObtenerVendedor = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { _id } = req.user as { _id: "" };

  if (!_id) return res.status(400).json({ msg: "No auth" });

  try {
    const BuscarUsuario = await VendedoresModel.find({
      usuarioContenedor: _id,
    });
    const totalVentasVendedores = await FacturaModel.find({
      vendedorId: { $in: BuscarUsuario.map((v) => v._id) },
    });

    const totalDeVentas = BuscarUsuario.map((v) => {
      const ventas = totalVentasVendedores.filter(
        (venta) => venta.vendedorId.toString() === v._id.toString()
      );
      return {
        vendedor: v,
        totalDeVentas: ventas.length,
        totalDeMonto: ventas.reduce((acc, curr) => acc + curr.total, 0),
      };
    });

    res.status(200).send(totalDeVentas);
  } catch (error) {
    res.status(500).send({ msg: "Error al obtener los vendedores" });
  }
};

export const EliminarVendedor = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { _id } = req.user as { _id: "" };
  const { SellerId } = req.body;
  if (!_id) return res.status(400).json({ msg: "No auth" });
  if (!SellerId) return res.status(400).json({ msg: "Faltan datos" });
  console.log(SellerId)
  try {
    await VendedoresModel.findByIdAndDelete(SellerId);
    res.status(200).send({ msg: "Vendedor eliminado" });
  } catch (error) {
    
    res.status(500).send({ msg: "Error al eliminar el vendedor", error});
  }
};

export const EditarVendedor = async (
  req: Request,
  res: Response
): Promise<any> => {
  const IdDeUsuario = (req.user as { _id: string })?._id;
  const { firstName, lastName, email, phone, _id }: ISeller = req.body.seller;
  if (!IdDeUsuario) return res.status(400).json({ msg: "No auth" });
  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({ msg: "Faltan datos" });
  }

  try {
    await VendedoresModel.findByIdAndUpdate(_id, {
      firstName,
      lastName,
      email,
      phone,
    });
    res.status(200).send({ msg: "Vendedor actualizado" });
  } catch (error) {
    res.status(500).send({ msg: "Error al actualizar el vendedor" });
  }
};

export const GenerarReporte = async (
  req: Request,
  res: Response
): Promise<any> => {
  const IdDeUsuario = (req.user as { _id: string })?._id;
  const { sellerId, sellerName, description, createdAt, isResolved }: IReport =
    req.body.Report;

  if (!IdDeUsuario) return res.status(400).json({ msg: "No auth" });
  console.log(req.body);
  const nuevoReporte = new ReportesModel({
    sellerId,
    sellerName,
    description,
    createdAt,
    isResolved,
    usuarioContenedor: IdDeUsuario,
  });

  try {
    const nuevoReporteGuardado = await nuevoReporte.save().then(async (reporte) => {
      const reporteGuardado = await ReportesModel.findById(reporte._id).populate("sellerId");
      return reporteGuardado;
    } );
    res.status(200).send({ msg: "Reporte creado" , nuevoReporteGuardado });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Error al crear el reporte" });
  }
};

export const ObtenerReportes = async (
  req: Request,
  res: Response
): Promise<any> => {
  const IdDeUsuario = (req.user as { _id: string })?._id;

  if (!IdDeUsuario) return res.status(400).json({ msg: "No auth" });

  const reportes = await ReportesModel.find({
    usuarioContenedor: IdDeUsuario,
  }).populate("sellerId");

  try {
    res.status(200).send({ reportes });
  } catch (error) {
    res.status(500).send({ msg: "Error al obtener reportes" });
  }
};

export const EditarReporte = async (
  req: Request,
  res: Response
): Promise<any> => {
  const IdDeUsuario = (req.user as { _id: string })?._id;
  const { _id, isResolved } = req.body.Report;
  if (!IdDeUsuario) return res.status(400).json({ msg: "No auth" });

  const reportes = await ReportesModel.findByIdAndUpdate(_id, {
    isResolved,
  }).populate("sellerId");

  try {
    res.status(200).send({ reportes });
  } catch (error) {
    res.status(500).send({ msg: "Error al obtener reportes" });
  }
};

export const EliminarReporte = async (
  req: Request,
  res: Response
): Promise<any> => {
  const IdDeUsuario = (req.user as { _id: string })?._id;
  const { _id } = req.body.Report;
  if (!IdDeUsuario) return res.status(400).json({ msg: "No auth" });

  const reportes = await ReportesModel.findByIdAndDelete(_id)

  try {
    res.status(200).send({ msg: "Reporte eliminado" });
  } catch (error) {
    res.status(500).send({ msg: "Error al eliminar el reporte" });
  }
};


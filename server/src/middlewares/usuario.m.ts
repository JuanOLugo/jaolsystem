import UsuarioModel from "../BaseDeDatos/Modelos/Usuario.model";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import FacturaModel from "../BaseDeDatos/Modelos/Factura.model";
import ProductoEnFacturaModel, {
  IProductoEnFactura,
} from "../BaseDeDatos/Modelos/ProductoEnFactura.model";

const SECRET_KEY = process.env.SECRET_KEY ?? "123456789";

export const InicioSesionUsuario = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ msg: "Todos los campos son necesarios" });
  }

  const VerificarUsuario = await UsuarioModel.findOne({ correo: email }).select(
    "+contraseña"
  );
  if (!VerificarUsuario) {
    return res.status(400).send({ msg: "El usuario no existe" });
  }

  if (await bcrypt.compare(password, VerificarUsuario.contraseña)) {
    const { contraseña, ...resto } = VerificarUsuario.toObject();
    const token = sign(resto, SECRET_KEY);
    return res.status(200).cookie("token", token).send({ msg: "User login" });
  } else {
    return res.status(400).send({ msg: "Credenciales incorrectas" });
  }
};

export const RegistrarUsuario = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, email, password, role, createdIn } = req.body;
  if (!username || !email || !password || !role || !createdIn) {
    return res.status(400).send({ msg: "Todos los campos son necesarios" });
  }

  const VerificarUsuario = await UsuarioModel.findOne({ correo: email });
  if (VerificarUsuario) {
    return res.status(400).send({ msg: "El usuario ya existe" });
  }

  const nuevoUsuario = new UsuarioModel({
    nombreusuario: username,
    correo: email,
    contraseña: await bcrypt.hash(password, 15),
    rol: role,
    estado: false,
    creadoEn: createdIn,
  });

  const GuardarUsuario = await nuevoUsuario.save();
  if (GuardarUsuario) {
    const { contraseña, ...resto } = GuardarUsuario.toObject();
    const token = sign(resto, SECRET_KEY);
    return res
      .status(200)
      .cookie("token", token)
      .send({ msg: "User registered" });
  } else {
    return res.status(400).send({ msg: "Error al crear el usuario" });
  }
};

export const UserBasic = async (req: Request, res: Response): Promise<any> => {
  const { _id } = req.user as { _id: "" };
  const { date } = req.body;

  try {
    const filtrarFactura = await FacturaModel.find({
      usuariocontenedor: _id,
      creadoEn: date,
    });
    if (filtrarFactura) {
      const ultimosDosItems = filtrarFactura.splice(-2);
      let ultimaCantidad: number[] = [];
      const CantidadDeProductos = ultimosDosItems.map(async (item) => {
        const productoEnfacturas = await ProductoEnFacturaModel.find({
          facturacontenedora: item._id,
        });
        let cantidad = 0;
        productoEnfacturas.map((e) => {
          cantidad = cantidad + e.cantidad;
        });

        ultimaCantidad.push(cantidad);
      });

      res.status(200).send({
        user: req.user,
        facturas: ultimosDosItems,
        cantidadDeProductos: ultimaCantidad,
      });
    }
  } catch (error) {
    return res.status(500).send({ msg: "Error al obtener informacion" });
  }
};

import req from "supertest";
import app from "../index";
import {
  conexionDbPrincipal,
  desconectarDbPrincipal,
} from "../BaseDeDatos/BaseDeDatos.conexion";

let userToken: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmV1c3VhcmlvIjoiSnVhbiBBbmRyZXMgT2plZGEiLCJjb3JyZW8iOiJqdWFuMTIzNDU2QGdtYWlsLmNvbSIsImNyZWFkb0VuIjoiMjAyMS0wMS0wMSIsImVzdGFkbyI6ZmFsc2UsInJvbCI6ImFkbWluIiwiX2lkIjoiNjdmNTc0YjUyYjgyMDIwOTk0YjQzY2YzIiwiX192IjowLCJpYXQiOjE3NDQxMzk0NDV9.2zQojPrhZ32R7rCG9LusVImIJT6mDhZDEKOy8M7zThk";

beforeAll(async () => {
  await conexionDbPrincipal();
});

afterAll(async () => {
  await desconectarDbPrincipal();
});

describe("test de la ruta productos", () => {
  it("Post Crear producto", async () => {
    const response = await req(app)
      .post("/api/product/create")
      .set("Authorization", `${"Bearer " + userToken}`)
      .send({
        codigo: "2089",
        nombre: "producto de prueba",
        precioCosto: 1000,
        precioVenta: 1500,
        proveedor: "local",
        date: "01/01/2025",
      });

    if (response.status === 201) {
      expect(response.body.message).toBe("Producto creado");
    } else {
      expect(response.body.error).toBe("Error al crear el producto");
    }
  });
});

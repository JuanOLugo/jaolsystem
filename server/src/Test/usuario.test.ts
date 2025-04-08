import req from "supertest";
import app from "../index";
import {
  conexionDbPrincipal,
  desconectarDbPrincipal,
} from "../BaseDeDatos/BaseDeDatos.conexion";

//Antes de hacer los test comenta la linea de app.listen para que pueda funcionar los respectivos test

beforeAll(async () => {
  await conexionDbPrincipal();
});

afterAll(async () => {
  await desconectarDbPrincipal();
});

let userToken: string = "";

describe("Test de la ruta usuarios", () => {
  it("Post Registrar usuario", async () => {
    const response = await req(app).post("/api/auth/register").send({
      username: "Juan Andres Ojeda",
      email: "juan123456@gmail.com",
      password: "123456",
      role: "admin",
      createdIn: "2021-01-01",
    });

    if (response.status === 200) {
      expect(response.body.msg).toBe("User registered");
      userToken = response.headers["set-cookie"][0].split(";")[0].split("=")[1];
      console.log(userToken);
    } else {
      expect(response.body.msg).toBe("El usuario ya existe");
    }
  });

  it("post autoLog in", async () => {
    const response = await req(app).post("/api/auth/login").send({
      email: "juanAndresOjeda12@gmail.com",
      password: "123456",
    });
    expect(response.status).toBe(200);
    userToken = response.headers["set-cookie"][0].split(";")[0].split("=")[1];
  });
});

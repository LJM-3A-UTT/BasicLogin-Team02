// __tests__/auth.test.ts
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { singIn } from "../utils/auth";

describe("Login tests", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("login exitoso devuelve token", async () => {
    const mockData = { token: "123abc" };
    mock.onPost("http://localhost:4000/api/auth/login").reply(200, mockData);

    const data = await singIn("a@a.com", "12345678");
    expect(data.token);
  });

  it("login con credenciales incorrectas lanza error 400", async () => {
    mock.onPost("http://localhost:4000/api/auth/login").reply(400, {
      msg: "Credenciales inválidas",
    });

    try {
      await singIn("user@test.com", "wrongpassword");
    } catch (err: any) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.msg).toBe("Usuario o contraseña incorrectos");
    }
  });

  it("Correo Invalido",async () => {
    mock.onPost("http://localhost:4000/api/auth/login").reply(400, {
      msg: "Correo inválido",
    });

    try {
      await singIn("a@a", "12345678");
    } catch (err: any) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.msg).toBe("El correo no es válido");
    }
  })

});

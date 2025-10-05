import MockAdapter from "axios-mock-adapter";
import nasaApi from "../api/nasaApi";
import { getApod } from "../utils/getApod";

describe("getApod API test", () => {
  it("debe devolver los datos esperados de la NASA", async () => {
    // 🔹 1. Crear el mock del cliente axios
    const mock = new MockAdapter(nasaApi);

    // 🔹 2. Datos falsos simulando la API
    const mockResponse = {
      title: "Imagen del día",
      url: "https://example.com/nasa.jpg",
      explanation: "Una imagen de prueba",
    };

    // 🔹 3. Interceptar la petición GET
    mock
      .onGet("/planetary/apod")
      .reply(200, mockResponse);

    // 🔹 4. Ejecutar la función real
    const data = await getApod();

    // 🔹 5. Verificar resultados
    expect(data).toEqual(mockResponse);
    expect(data.url).toBe("https://example.com/nasa.jpg");

    // 🔹 6. Verificar que se hizo la petición al endpoint correcto
    expect(mock.history.get[0].url).toBe("/planetary/apod");
  });

  it("debe manejar errores correctamente", async () => {
    const mock = new MockAdapter(nasaApi);
    mock.onGet("/planetary/apod").reply(500);

    try {
      await getApod();
    } catch (error: any) {
      expect(error.response.status).toBe(500);
    }
  });
});

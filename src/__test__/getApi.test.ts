import MockAdapter from "axios-mock-adapter";
import nasaApi from "../api/nasaApi";
import { getApod } from "../utils/getApod";

describe("getApod API test", () => {
  it("debe devolver los datos esperados de la NASA", async () => {
    
    const mock = new MockAdapter(nasaApi);

    
    const mockResponse = {
      title: "Imagen del día",
      url: "https://example.com/nasa.jpg",
      explanation: "Una imagen de prueba",
    };

    
    mock
      .onGet("/planetary/apod")
      .reply(200, mockResponse);

    
    const data = await getApod();

    
    expect(data).toEqual(mockResponse);
    expect(data.url).toBe("https://example.com/nasa.jpg");

    
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

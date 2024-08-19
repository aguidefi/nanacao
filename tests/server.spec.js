const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {

  it('devuelve status 200 y un array', async () => {
      const response = await request(server).get('/cafes');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toBeInstanceOf(Object);
      expect(response.body.length).toBeGreaterThan(0);
  });

  it('retorna 404 cuando se intenta borrar un cafe que no existe', async () => {
    const token = 'token-autorizacion';
    const response = await request(server)
        .delete('/cafes/1000')
        .set("Authorization", token);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: "No se encontró ningún cafe con ese id" });
  });

  it('retorna 201 cuando se crea un nuevo cafe', async () => {
    const newCafe = {
      id: 5,
      nombre: 'Macchiato'
    };
    const response = await request(server)
      .post('/cafes')
      .send(newCafe);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expect.arrayContaining([newCafe]));
  });

  it('retorna 400 cuando se intenta actualizar un cafe enviando un id que no coincide', async () => {
    const cafeToUpdate = {
      id: 4,
      nombre: 'Latte'
    };
    const response = await request(server)
      .put('/cafes/6') 
      .send(cafeToUpdate);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: "El id del parámetro no coincide con el id del café recibido"
    });
  });
});

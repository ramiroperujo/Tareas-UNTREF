// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
  res.send(BD);
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
  const nuevaFruta = req.body;
  BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
  guardarFrutas(BD); // Guardar los cambios en el archivo
  res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

// Ruta para obtener un producto por su ID
app.get("/productos/:id", (req, res) => {
  const { id } = req.params;
  const producto = BD.find((p) => p.id === parseInt(id));

  if (!producto) {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  } else {
    res.json(producto);
  }
});

// Ruta para modificar un producto existente por su ID
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, importe, stock } = req.body;

  const producto = BD.find((p) => p.id === parseInt(id));

  if (!producto) {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  } else {
    producto.nombre = nombre;
    producto.importe = importe;
    producto.stock = stock;

    guardarFrutas(BD); // Guardar los cambios en el archivo

    res.send("Producto modificado exitosamente");
  }
});

// Ruta para eliminar un producto existente por su ID
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;

  const index = BD.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    res.status(404).json({ mensaje: "Producto no encontrado" });
  } else {
    BD.splice(index, 1); // Eliminar el producto del arreglo

    guardarFrutas(BD); // Guardar los cambios en el archivo

    res.send("Producto eliminado exitosamente");
  }
});

// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

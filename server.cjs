const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; // Puedes cambiar el puerto según tu preferencia

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'maimai',
  database: 'reservacion',
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Ruta para manejar las solicitudes POST de reservas
app.post('/api/reservations', (req, res) => {
  const { name, email, date } = req.body;

  // Realiza la inserción en la base de datos
  const sql = 'INSERT INTO tu_tabla_reservas (nombre, email, fecha) VALUES (?, ?, ?)';
  db.query(sql, [name, email, date], (err, result) => {
    if (err) {
      console.error('Error al procesar la reserva en la base de datos:', err);
      res.status(500).json({ error: 'Error en el servidor al procesar la reserva.' });
    } else {
      res.status(200).json({ message: 'Reserva realizada con éxito' });
    }
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor backend en ejecución en el puerto ${port}`);
});

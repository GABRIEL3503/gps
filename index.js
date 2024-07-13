const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let colectivos = [];

app.use(bodyParser.json());

app.post('/update-location', (req, res) => {
  const { id, lat, lng } = req.body;
  const colectivoIndex = colectivos.findIndex(c => c.id === id);

  if (colectivoIndex >= 0) {
    colectivos[colectivoIndex] = { id, lat, lng };
  } else {
    colectivos.push({ id, lat, lng });
  }

  io.emit('locationUpdate', colectivos);

  res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  socket.emit('locationUpdate', colectivos);
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

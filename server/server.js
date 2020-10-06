const express = require('express');
const path = require('path');
const http = require('http');
const axios = require('axios');
const app = express();
const port = 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/../public')));

const cb = (res, resProxy) => {
  let data = '';

  res.on('data', d => {
    data += d
  })
  res.on('end', () => {
    resProxy.send(data);
  })
};

app.get('/api/dishes/restaurant/:id', (reqProxy, resProxy) => {
  http.get(`http://localhost:3001/api/dishes/restaurant/${reqProxy.params.id}`, (res) => {
    cb(res, resProxy);
  });
});

app.get('/api/bookings/restaurantName/:id', (reqProxy, resProxy) => {
  http.get(`http://localhost:3000/api/bookings/restaurantName/${reqProxy.params.id}?restaurantId=${reqProxy.params.id}`, (res) => {
    cb(res, resProxy);
  });
});

app.get('/api/bookings/:id', (reqProxy, resProxy) => {
  console.log('herlr')
  http.get(`http://localhost:3000/api/bookings/${reqProxy.params.id}`, (res) => {
    cb(res, resProxy);
  });
});

app.post('/api/bookings/:id', (reqProxy, resProxy) => {
  const reservation = reqProxy.body;
  reservation.restaurantId = reqProxy.params.restaurantId;
  axios.post(`http://localhost:3000/api/bookings/${reqProxy.params.id}`, reqProxy.body)
    .then((response) => {
      resProxy.send(response)
    })
});









app.listen(port, () => {
  console.log(`Proxy running at http://localhost:${port}`);
});
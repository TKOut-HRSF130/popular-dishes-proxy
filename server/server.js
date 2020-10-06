const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const port = 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/../public')));

app.get('/api/dishes/restaurant/:id', (reqProxy, resProxy) => {
  http.get(`http://localhost:3001/api/dishes/restaurant/${reqProxy.params.id}`, (res) => {
    let data = '';

    res.on('data', d => {
      data += d
    })
    res.on('end', () => {
      resProxy.send(data);
    })
  })
});

app.listen(port, () => {
  console.log(`Proxy running at http://localhost:${port}`);
});
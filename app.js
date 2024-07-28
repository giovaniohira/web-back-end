const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.listen(PORT, () => {
  console.log(`Running at port ${PORT}`);
});


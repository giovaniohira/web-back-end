const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');

// Middleware para verificar login
function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Página inicial
router.get('/', (req, res) => {
  fs.readdir(pagesDir, (err, files) => {
    if (err) throw err;
    const pages = files.map(file => file.replace('.txt', ''));
    res.render('home', { pages });
  });
});

// Visualização de página
router.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(pagesDir, `${page}.txt`);
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) res.status(404).send('Página não encontrada');
    else res.render('page', { content: data });
  });
});

// Criação de página
router.get('/admin', checkAuth, (req, res) => {
  res.render('create');
});

router.post('/admin/create', checkAuth, (req, res) => {
  const { url, content } = req.body;
  const filePath = path.join(pagesDir, `${url}.txt`);
  fs.writeFile(filePath, content, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Edição de página
router.get('/admin/edit/:page', checkAuth, (req, res) => {
  const page = req.params.page;
  const filePath = path.join(pagesDir, `${page}.txt`);
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) res.status(404).send('Página não encontrada');
    else res.render('edit', { url: page, content: data });
  });
});

router.post('/admin/edit/:page', checkAuth, (req, res) => {
  const page = req.params.page;
  const { content } = req.body;
  const filePath = path.join(pagesDir, `${page}.txt`);
  fs.writeFile(filePath, content, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Exclusão de página
router.post('/admin/delete/:page', checkAuth, (req, res) => {
  const page = req.params.page;
  const filePath = path.join(pagesDir, `${page}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;

const express = require('express')
const app = express()

//springbootでいう画像やcss等のstaticの設定
app.use(express.static('public'));
//postで必要
app.use(express.urlencoded({extended: false}));

//今回使用するのはMySQL
const mysql = require('mysql');

//MySQLとの接続
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysqlmysql',
  database: 'list_app'
});

connection.connect();

app.get('/', (req, res) => {
  res.render('top.ejs');
});


app.get('/index', (req, res) => {
  connection.query(
    'SELECT id, name FROM items ORDER BY id',
    (error, results) => {
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

//get:ページ遷移するとき
//post:データベースをアップデートするとき
app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO items(name) VALUES(?)',
    [req.body.itemName],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

//商品の消去
app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

//商品の編集
app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE items SET name = ? WHERE id = ?',
    [req.body.itemName, req.params.id],
    (error, results) => {
      console.log(results);
      res.redirect('/index');
    }
  );
});

app.listen(3000);

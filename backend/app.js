const express = require('express');
const mysql = require('mysql');
const app = express();
// 選択されたチーム名を受け取る
// const team1 = document.getElementById('select1').value;

const corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200
};


app.use(express.static('public'));
app.use(express.json());
// フォームから送信された値を受け取る
app.use(express.urlencoded({extended: true}));


// CORSエラーを回避する記述ここから
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
// ここまで


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'heirinmou',
  database: 'mfes',
  multipleStatements: true // 複数のステートメントを有効にする
});

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM team; SELECT * FROM court',
    (error, results) => {
      console.log(results[0]);
      console.log(results[1]);
      res.render('index.ejs', {items: results[0], courts: results[1]});
    }
  );
});

// DBから表に反映させるルーティング
app.get('/match', (req, res) => {
  connection.query(
    'SELECT * FROM team',
    (error, results) => {
      console.log("確認につかう");
      console.log(results);
      res.render('match.ejs', {teams: results});
    }
  );
});

// DBを編集するルーティング
app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM team WHERE id = ?; SELECT * FROM court',
    [ req.params.id ],
    (error, results) => {
      console.log("配列修正の結果↓");
      console.log(results[0]);
      console.log(results[1]);
      res.render('edit.ejs', {teams: results[0], courts: results[1]});
    }
  );
});
// DBを更新するルーティング
app.post('/update/:id', (req, res) => {
  console.log("ここから結果");
  console.log(req.params.id);
  console.log("ここまで")
  connection.query(
    'UPDATE team SET court = ? WHERE id = ?',
    [ req.body.itemName, req.params.id ],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});
app.get('/match', (req, res) => {
  res.render('match.ejs');
});

// DBに追加するルーティング
app.post('/create', (req, res) => {
  // DBに追加する処理
  connection.query(
    'INSERT INTO team(name)VALUES(?)',
    [req.body.itemName],
    (error, results) => {
      // 一覧画面にリダイレクトする処理
      res.redirect('/index');
    }
  );
  
});

// DBから削除するルーティング
app.post('/delete/:id', (req,res) => {
  // 処理
  connection.query(
    'UPDATE team SET court = NULL WHERE id = ?',
    [ req.params.id ],
    (error,results) => {
      // 一覧画面にリダイレクトする処理
      res.redirect('/index');
    }
  );
});



app.listen(3000);
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
      res.render('index.ejs', {items: results[0], courts: results[1]});
    }
  );
});

// DBから表に反映させるルーティング
app.get('/match', (req, res) => {
  connection.query(
    'SELECT * FROM team; SELECT * FROM court; SELECT * FROM game',
    (error, results) => {
      res.render('match.ejs', {teams: results[0], courts: results[1], games: results[2]});
    }
  );
});

// DBを編集するルーティング
app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM team WHERE id = ?; SELECT * FROM court',
    [ req.params.id ],
    (error, results) => {
      res.render('edit.ejs', {teams: results[0], courts: results[1]});
    }
  );
});
// DBを更新するルーティング
app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE team SET court = ? WHERE id = ?;UPDATE team SET number = ?  WHERE id = ?',
    [ req.body.itemName, req.params.id, req.body.itemNum, req.params.id ],
    (error, results) => {
      res.redirect('/index');
    }
  );
});
// 点数を登録するルーティング
app.post('/entry/:id', (req, res) => {
  const result1 = req.body.result1;
  const result2 = req.body.result2;
  const result3 = req.body.result3;
  const result4 = req.body.result4;
  var point_A = 0;
  var point_B = 0;
  if (Number(result1) > Number(result3) && Number(result2) > Number(result4)) {
    point_A = 5;
    point_B = 0;
  } else if (Number(result1) < Number(result3) && Number(result2) < Number(result4)) {
    point_A = 0;
    point_B = 5;
  } else if (Number(result1) > Number(result3) && Number(result2) < Number(result4)) {
    if (Number(result1) + Number(result2) > Number(result3) + Number(result4)) {
      point_A = 3;
      point_B = 1;
    } else if (Number(result1) + Number(result2) < Number(result3) + Number(result4)) {
      point_A = 1;
      point_B = 3;
    } else {
      point_A = 2;
      point_B = 2;
    }
  } else if (Number(result1) < Number(result3) && Number(result2) > Number(result4)) {
    if (Number(result1) + Number(result2) > Number(result3) + Number(result4)) {
      point_A = 3;
      point_B = 1;
    } else if (Number(result1) + Number(result2) < Number(result3) + Number(result4)) {
      point_A = 1;
      point_B = 3;
    } else {
      point_A = 2;
      point_B = 2;
    }
  } else {
    console.log('エラー');
  }
  console.log("チェックここから");
  console.log(point_A);
  console.log(point_B);
  console.log("チェックここまで");
  connection.query(
    'UPDATE game SET result1 = ?, result2 = ?, result3 = ?, result4 = ?, point_A = ?, point_B = ? WHERE game_id = ?',
    [ req.body.result1, req.body.result2 ,req.body.result3, req.body.result4, point_A, point_B, req.params.id ],
    (error, results) => {
      res.redirect('/match');
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

// DBからコートを削除するルーティング
app.post('/delete/:id', (req,res) => {
  // 処理
  connection.query(
    'UPDATE team SET court= null, number = null WHERE id = ?',
    [ req.params.id ],
    (error,results) => {
      // 一覧画面にリダイレクトする処理
      res.redirect('/index');
    }
  );
});



app.listen(3000);
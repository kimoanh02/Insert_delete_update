const mysql = require('mysql')
const express = require('express')
const bodyparser = require('body-parser')

const app = express();
const PORT = 3000;

app.use(bodyparser.json());

const conn = mysql.createConnection({
    database: 'my_database',
    host: "localhost",
    user: "root",
    password: "oanhoanh",
    multipleStatements: true
});

conn.connect(function(err) {
    if (!err)
        console.log("Connected!");
    else
        console.log("error connect");
});
app.get('/Sinhviens/:name', (req, res) => {
    conn.query('SELECT * FROM sv Where name= ?', [req.params.name], (err, rows, fields) => {
        if (!err)
            res.send(rows)
        else
            console.log(err);
    })
});
app.listen(PORT, () => console.log(`Express server is running: ${PORT}`));

//delete
app.delete('/Sinhviens/:name', (req, res) => {
    conn.query('DELETE FROM sv where name= ?', [req.params.name], (err, rows, fields) => {
        if (!err)
            res.send('delete successfully');
        else
            console.log(err);
    })
});

//insert
app.post('/Sinhviens', (req, res) => {
    let emp = req.body;
    var sql = "SET @name= ?; SET @masv= ?; SET @lop= ?; \
    CALL svaddorexit(@name, @masv, @lop);";
    conn.query(sql, [emp.name, emp.masv, emp.lop], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array)
                    res.send('inserted employee ' + element[0].masv);
            });
        else
            console.log(err);
    })
})

// update
app.put('/Sinhviens', (req, res) => {
    var sql = "UPDATE sv SET name='trang' where masv=2";
    conn.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
    });

    conn.end(function(err) {
        if (err) throw err;
        console.log("closed program")
    });
})
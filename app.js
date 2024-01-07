const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const path = require("path");
const bodyparser = require("body-parser");
const mysql = require('mysql');
const { log } = require("console");
require("dotenv").config();

// const routepage = require('./server/router/allRoutes');
const port = process.env.port||5000;
app.use(bodyparser.urlencoded({extname:false}));
app.use(bodyparser.json());

//Static folder
app.use(express.static("public"));

//templating engine setup
app.engine("hbs",handlebars.engine({extname:"hbs",defaultLayout:false,layoutsDir:"home"}))
app.set("view engine","hbs");

const con = mysql.createPool({
    connectionLimit : 10,
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    user : process.env.DB_USER,
    password : process.env.DB_PASS
})


//EDIT
app.get('/edit/:id', (req, res) => {
    con.getConnection((err, connect) => {
        if (err) throw err
        let id = req.params.id;
        connect.query("select*from details where id=?", [id], (err, row) => {
            if (!err) {
                res.render('edit', { row });
            }
            else {
                console.log('ERROR IN EDIT' + err);
            }
        })
    })
})

//EDIT
app.post('/edit/:id', (req, res) => {
    con.getConnection((err, connect) => {
        if (err) throw err
        const { name, cgpa, department } = req.body;
        let id = req.params.id;
        connect.query("update details set name=?,cgpa=?,department=? where id=?", [name, cgpa, department, id], (err, row) => {
            connect.release();
            if (!err) {

                res.render('edit', { val: true,msg: `USER DEATILS UPDATED SUCCESSFULLY` });
            
         
            }
            else {
                console.log('ERROR IN UPDATE' + err);
            }
        })
    })
})

//DELETE
app.get('/delete/:id',(req,res)=>{
    con.getConnection((err,connect)=>{
        if(err) throw err
        let id = req.params.id;
        console.log(id);
        connect.query("delete from details where id=?",[id],(err,rows)=>{
            connect.release();
            if(!err){
                res.redirect('/');
            }
            else{
                console.log(err);
            }
        });
    })
})


app.get('/',(req,res)=>{
       con.getConnection((err,connection)=>{
        if(err) throw err
        else{
          connection.query("select*from details",(err,rows)=>{
            connection.release();
            if(!err){
                console.log("good");
                res.render('home',{rows})
            }
            else{
                console.log('error in querry'+err);
            }
          })
        }
       })
})

app.get('/register',(req,res)=>{
    res.render('register');
})

//READ
app.get('/home',(req,res)=>{
    con.getConnection((err,connection)=>{
        if(err) throw err
        else{
          connection.query("select*from details",(err,rows)=>{
            connection.release();
            if(!err){
                console.log("good");
                res.render('home',{rows})
            }
            else{
                console.log('error in querry'+err);
            }
          })
        }
       })
})

//CREATE
app.post('/register/',(req,res)=>{
    con.getConnection((err,connection)=>{
        if(err) throw err
        const {name,cgpa,department} = req.body;
        connection.query("insert into details (name,cgpa,department) values (?,?,?)",[name,cgpa,department],(err,rows)=>{
            connection.release();
            if(!err){
                res.render('register')
            }
            else{
                console.log("error"+err);
            }
        })
    })
})

app.listen(port,()=>{
    console.log("your port number "+port+" is running...");
})
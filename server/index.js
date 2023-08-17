const express = require("express");
const app = express();
const port = 3001;
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user:"user_dev",
    password:"probosque",
    database:"react"
});

app.post("/create", (req, res)=>{
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const cargo = req.body.cargo;

    db.query("INSERT INTO `users` (`nombre`, `edad`, `cargo`) VALUES (?,?,?)", [nombre, edad, cargo],
    (err, result) => {
        if (err) {
            console.log(err);
        }else{ 
            res.json({"error": false, "msg": "Usuario agregado"});
        }
    }
    );
});

app.put("/update", (req, res)=>{
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const cargo = req.body.cargo;
    const id = req.body.id;

    db.query("UPDATE users SET nombre=?, edad=?, cargo=? WHERE id_user=?", [nombre, edad, cargo, id],
    (err, result) => {
        if (err) {
            console.log(err);
        }else{ 
            res.json({"error": false, "msg": "Usuario actualizado"});
        }
    }
    );
});

app.delete("/delete/:id", (req, res)=>{
    const id = req.params.id; 
    
    db.query("DELETE FROM users WHERE id_user=?", id,
    (err, result) => {
        if (err) {
            console.log(err);
        }else{ 
            res.json({"error": false, "msg": "Usuario eliminado"});
        }
    }
    );
});

app.get("/users", (req, res)=>{ 
    db.query("SELECT * FROM users",
    (err, result) => {
        if (err) {
            console.log(err);
        }else{
            res.send(result);            
        }
    }
    );
});

app.listen(port, ()=>{
    console.log("Run port "+port);
})
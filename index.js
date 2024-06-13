const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const users = require('./data/agentes.js')

app.listen(3000, () =>
{
    console.log("Conectado al servidor 3000");
})

app.use(express.json());

//app.use(express.static("./"));

const secretKey = process.env.JWT_SECRET;

app.get("/", (req, res) =>
{
    res.sendFile(__dirname + "/index.html");
})

app.get("/sigue", (req, res) =>
{
     let { token } = req.query; 
     jwt.verify(token, secretKey, (err, decoded) => 
    { 
        err ? res.status(401).send(
            { 
                error: "401 Unauthorized", 
                message: err.message, 
            }
        ) 
        : res.send(` Bienvenido al Sigue ${decoded.data.email} 
            <script> 
            localStorage.setItem('email', "${decoded.data.email}") </script> `,
        ); 
    })
})


app.post("/SignIn", (req, res) =>
{
    const { email, password } = req.body; 
    const user = users.results.find((u) => u.email == email && u.password == password); 

    if(user) 
    { 
        const token = jwt.sign( 
            {   
                exp: Math.floor(Date.now() / 1000) + 300, 
                data: user, 
            }, 
            secretKey 
        ); 
        
        res.send(` 
            <a href="/sigue?token=${token}"> 
                <p> Ir a Sigue </p> 
            </a> Bienvenido, ${email}. 
            <script> 
                sessionStorage.setItem('token', JSON.stringify("${token}")) 
            </script> `
        ); 
    } 
    else 
    { 
        res.send("Usuario o contraseña incorrecta"); 
    }
})
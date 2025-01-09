//#region Setando
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:3000"],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const saltRounds = parseFloat(process.env.SALT_ROUNDS);

const session = require("express-session");
const cookieParser = require("cookie-parser");


const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    connectionLimit: 10
});
//#endregion


app.get("/users", (req, res) => {
    const sqlSelect = "SELECT * FROM usuarios";

    db.query(sqlSelect, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

app.get("/check-session", (req, res) => {
    if (req.session.username) {
        return res.status(200).json({ valid: true, username: req.session.username });
    } else {
        return res.status(401).json({ valid: false });
    }
});

app.post("/signup", (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            console.error(`Erro ao gerar o salt: ${err}`);
            return res.status(500).json({ message: "erro interno ao gerar o salt." });
        }

        bcrypt.hash(senha, salt, (err, hashedPassword) => {
            if (err) {
                console.error(`Erro ao gerar o hash da senha: ${err}`);
                return res.status(500).json({ message: "Erro interno ao gerar o hash da senha." });
            }
    
            const sqlInsert = "INSERT INTO usuarios (`nome`, `email`, `senha`) VALUES (?)";
        
            const values = [nome, email, hashedPassword];
        
            db.query(sqlInsert, [values], (err, data) => {
                if (err) {
                    console.error("Erro ao inserir no banco de dados:", err);
                    return res.status(500).json({ message: "Erro ao criar usuário." });
                }
                req.session.username = nome;
                return res.status(201).json(data);
            })
        });
    });
});

app.post("/login", (req, res) => {
    const sqlSel = "SELECT * FROM usuarios WHERE email = ?";
    const {email, senha} = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    db.query(sqlSel, [email], (err, result) => {
        if (err) {
            console.error(`Erro ao buscar usuário: ${err}`)
            return res.status(500).json({ message: "Erro ao buscar usuário." });
        }
        if (result.length === 0) {
            return res.status(401).json({ message: "Email incorreto." });
        }

        const hashedPassword = result[0].senha;

        bcrypt.compare(senha, hashedPassword, (err, match) => {
            if (err) {
                console.error(`Erro ao comparar senhas: ${err}`);
                return res.status(500).json({ message: "Erro interno ao validar a senhas" });
            }
            if (!match) {
                return res.status(401).json({ message: "Senha incorreta.", Login: false });
            }

            req.session.username = result[0].nome;
            return res.status(200).json({ message: "Login bem-sucedido!", Login: true });
        })
    });
});

app.use ((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Ops... Algo deu errado!");
});

const port = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log(`Server running at ${port} port`);
});
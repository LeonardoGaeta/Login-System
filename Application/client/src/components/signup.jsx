import axios from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export function FormCadastro() {
    const navigate = useNavigate();

    const [valuesForm, setValuesForm] = useState({
        nome: "",
        email: "",
        senha: ""
    });

    const handleValues = event => {
        const { name, value } = event.target;
        setValuesForm({...valuesForm, [name]:value});
    }

    const handleSubmit = event => {
        event.preventDefault();
        axios.post('/signup', valuesForm)
        .then(res => console.log("Yuuppie"))
        .then(res => navigate("/login"))
        .catch(err => console.log(`Bad error: ${err}`));
    }

    return (
        <form onChange={handleValues} onSubmit={handleSubmit}>
            <div className="form">
                <label htmlFor="nome">Nome:</label>
                <input type="text" name="nome" id="nome" />
            </div>
            <div className="form">
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" />
            </div>
            <div className="form">
                <label htmlFor="senha">Senha:</label>
                <input type="password" name="senha" id="senha" />
            </div>

            <button type="submit">Enviar</button>
        </form>
    );
}
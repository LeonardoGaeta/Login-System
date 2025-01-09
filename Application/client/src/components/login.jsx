import axios from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export function FormLogin() {
    const navigate = useNavigate();

    const [valuesForm, setValuesForm] = useState({
        email: "",
        senha: ""
    });

    const handleValues = event => {
        const { name, value } = event.target;
        setValuesForm({...valuesForm, [name]: value});
    }

    const handleSubmit = event => {
        event.preventDefault();
        axios.post('/login', valuesForm)
        .then(res => { console.log(res.data)
            if (res.data.Login) {    
                navigate("/");
            } else {
                alert("IDIOTA");
            }
        })
        .catch(err => console.log(`Bad error: ${err}`));
    }

    return (
        <form onChange={handleValues} onSubmit={handleSubmit}>
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
    )
}
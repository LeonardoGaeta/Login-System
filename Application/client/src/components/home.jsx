import axios from "./axiosConfig";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function Home() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/check-session")
        .then(res => {
            setName(res.data.username);
        })
        .catch(err => {
            navigate("/login");
        }, [navigate]);
    });
    return (
        <div>
            <h1>Hello {name}</h1>
        </div>
    )
}
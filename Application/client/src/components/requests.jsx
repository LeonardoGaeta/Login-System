import axios from "./axiosConfig";
import { useState, useEffect } from 'react'
import '../App.css'

export function UserReq() {
    const [array, setArray] = useState([]);

    const fetchAPI = async () => {
        const response = await axios.get("/users");
        setArray(response.data);
    }

    useEffect(() => {
        fetchAPI();
    }, []);

    return (
        <>
            {
                <ul>
                {
                    array.map((value, index) => 
                        <li key={index}>
                            {value.id_user}, {value.nome}, {value.email}, {value.senha}
                        </li>
                    )
                }
                </ul>
            }
        </>
    )
}
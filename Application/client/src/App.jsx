import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import './App.css';

import { FormCadastro } from "./components/signup.jsx";
import { FormLogin } from "./components/login.jsx"
import { Home } from "./components/home.jsx";
import { PlainLeyout } from "./components/PlainLeyout.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PlainLeyout />} >
        <Route path="signup" element={<FormCadastro />} />
        <Route path="login" element={<FormLogin />} />
      </Route>
      
      <Route path="/" element={<Home />} />
    </>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App

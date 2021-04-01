import React from "react";
import { Link } from "react-router-dom";

export default function App() {
    return (<div className="text-center pt-2" >
        <h1>\x41*32</h1>
        <div className="d-flex align-items-center flex-column" >
            <div className="mt-2" >
                <Link to="/about" >About</Link>
            </div>
            <div className="mt-2" >
                <Link to="/writeups" >Writeups</Link>
            </div>
        </div>
    </div>)
}
import React from "react";

import {Link} from "react-router-dom"

export default function App() {
    return (<div className="text-center pt-2" >
        <h1>Page Not Found</h1>
        <div>
            The page you are looking for could not be found. <br />
            <Link to="/">Go Home</Link>
        </div>
    </div>)
}
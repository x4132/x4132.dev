import React from "react";
import { Link } from "react-router-dom";

export default function App() {
    return (<div className="text-center pt-2" >
        <h1>\x41*32</h1>
        <div className="d-flex align-items-center flex-column" >
            <div className="mt-2" >
                <Link to="/about" >Work</Link>
            </div>
            <div className="mt-2" >
                <Link to="/writeups" >Writeups</Link>
            </div>
        </div>
        <footer className="pb-2" >
        <div>
          <a href="https://twitter.com/bluninja1234" >Twitter</a>
        </div>
        <div className="ml-2" >
          <a href="https://tiktok.com/@x4132" onClick={e => { e.preventDefault(); window.location.assign("https://www.youtube.com/watch?v=dQw4w9WgXcQ"); return false; }} >Tiktok</a>
        </div>
        <div className="ml-2" >
          <a href="https://www.instagram.com/0x4132/" >Instagram</a>
        </div>
      </footer>
    </div>)
}
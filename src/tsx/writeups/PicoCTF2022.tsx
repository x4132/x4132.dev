import { Link, Route, Routes } from "react-router-dom";
import WebExploits from "./picoCTF2022/WebExploits";

import ranking from "../../img/pico2022ranking.png";

export default function PicoCTF2021() {

    return <Routes>
        <Route path={`webExploits/*`} element={<WebExploits />} />
        <Route path={"*"} element={<Index />} />
    </Routes>
}


function Index() {
    return <div className="d-flex flex-column align-items-center pt-2 text-center" >
        <div className="d-flex align-items-center" >
            <h1>Writeups&nbsp;/&nbsp;</h1><h2>picoCTF&nbsp;/&nbsp;</h2><h3>2022</h3>
        </div>

        <div className="mt-2" >
            <Link to={`webExploits`} >Web Exploitation</Link>
        </div>

        <div className="d-flex flex-column pt-4">
            <div>
                I did far better this year, getting 10th place in a 10 way tie for second
            </div>
            <div className="pt-2">
                <img src={ranking} alt={"ranking"} />
            </div>
        </div>
    </div>
}
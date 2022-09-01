import { Link, Route, Routes } from "react-router-dom";
import GeneralSkills from "./picoCTF2021/GeneralSkills";
import WebExploits from "./picoCTF2021/WebExploits";

import ranking from "../../img/pico2021ranking.png";

export default function PicoCTF2021() {

    return (
        <Routes>
            <Route path={`general`} element={<GeneralSkills />} />
            <Route path={`webExploits/*`} element={<WebExploits />} />
            <Route path={"*"} element={<Index />} />
        </Routes>
    )
}


function Index() {
    return (
        <div className="d-flex flex-column align-items-center pt-2 text-center" >
            <div className="d-flex align-items-center" >
                <h1>Writeups&nbsp;/&nbsp;</h1><h2>picoCTF&nbsp;/&nbsp;</h2><h3>2021</h3>
            </div>
            <div className="mt-2" >
                <Link to={`general`} >General Skills</Link>
            </div>
            <div className="mt-2" >
                <Link to={`webExploits`} >Web Exploitation</Link>
            </div>

            <div className="d-flex flex-column pt-4">
                <div>
                    First year doing picoCTF, ended up at 22nd place in canada with 3030 points
                </div>
                <div className="pt-2">
                    <img src={ranking} alt={"ranking"} />
                </div>
            </div>
        </div>
    )
}
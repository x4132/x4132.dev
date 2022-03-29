
import { Link, Route, Routes } from "react-router-dom";

import PicoCTF2021 from "./writeups/PicoCTF2021";
import PicoCTF2022 from "./writeups/PicoCTF2022";

export default function Writeups() {

    return (
        <Routes>
            <Route path={`picoCTF2021/*`} element={<PicoCTF2021 />} />
            <Route path={`picoCTF2022/*`} element={<PicoCTF2022 />} />
            <Route path={"*"} element={<Index url={"/writeups"} />} />
        </Routes>
    )
}

function Index({ url }: { url: string }) {
    return <div className="d-flex flex-column align-items-center pt-2" >
        <div>
            <h1>Writeups</h1>
        </div>
        <div className="mt-2" >
            <Link to={`${url}/picoCTF2021`} >picoCTF 2021</Link>
        </div>
        <div className="mt-2" >
            <Link to={`${url}/picoCTF2022`} >picoCTF 2022</Link>
        </div>
    </div>
}

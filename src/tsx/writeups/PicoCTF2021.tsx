import { Link } from "react-router-dom";

export default function PicoCTF2021({ url }: { url: string }) {
    return <div className="d-flex flex-column align-items-center pt-2" >
        <div className="d-flex align-items-center" >
            <h1>Writeups&nbsp;/&nbsp;</h1><h2>picoCTF&nbsp;/&nbsp;</h2><h3>2021</h3>
        </div>
        <div>
            Lmao winners haven't been announced yet
        </div>
        <div className="mt-2" >
            <Link to="/" >Go bac</Link>
        </div>
    </div>
}
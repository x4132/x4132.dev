import { Link, useRouteMatch, Route, Switch } from "react-router-dom";
import GeneralSkills from "./picoCTF2021/GeneralSkills";
import WebExploits from "./picoCTF2021/WebExploits";

import ranking from "../../img/pico2021ranking.png";

export default function PicoCTF2021() {
    const { path, url } = useRouteMatch();
    console.log(url);

    return <Switch>
        <Route path={`${path}/general`} >
            <GeneralSkills />
        </Route>
        <Route path={`${path}/webExploits`} >
            <WebExploits />
        </Route>
        <Route exact path={path} >
            <Index url={url} />
        </Route>
    </Switch>
}


function Index({ url }: { url: string }) {
    return <div className="d-flex flex-column align-items-center pt-2 text-center" >
        <div className="d-flex align-items-center" >
            <h1>Writeups&nbsp;/&nbsp;</h1><h2>picoCTF&nbsp;/&nbsp;</h2><h3>2021</h3>
        </div>
        <div className="mt-2" >
            <Link to={`${url}/general`} >General Skills</Link>
        </div>
        <div className="mt-2" >
            <Link to={`${url}/webExploits`} >Web Exploitation</Link>
        </div>

        <div className="d-flex flex-column pt-4">
            <div>
                First year doing picoCTF, ended up at 22nd place in canada with 3030 points
            </div>
            <div className="pt-2">
                <img src={ranking} />
            </div>
        </div>
    </div>
}
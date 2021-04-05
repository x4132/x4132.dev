import { Link, useRouteMatch, Route, Switch } from "react-router-dom";
import GeneralSkills from "./picoCTF2021/GeneralSkills";

export default function PicoCTF2021() {
    const { path, url } = useRouteMatch();

    return <Switch>
        <Route path={`${path}/general`} >
            <GeneralSkills />
        </Route>
        <Route exact path={path} >
            <Index url={url} />
        </Route>
    </Switch>
}


function Index({ url }: { url: string }) {
    return <div className="d-flex flex-column align-items-center pt-2" >
        <div className="d-flex align-items-center" >
            <h1>Writeups&nbsp;/&nbsp;</h1><h2>picoCTF&nbsp;/&nbsp;</h2><h3>2021</h3>
        </div>
        <div className="mt-2" >
            <Link to={`${url}/general`} >General Skills</Link>
        </div>
    </div>
}
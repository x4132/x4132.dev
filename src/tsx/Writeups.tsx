
import { Link, useRouteMatch, Route, Switch } from "react-router-dom";

import PicoCTF2021 from "./writeups/PicoCTF2021";

export default function Writeups() {
    const { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path} >
                <Index url={url} />
            </Route>
            <Route path={`${path}/picoCTF2021`} >
                <PicoCTF2021 url={url} />
            </Route>
        </Switch>
    )
}

function Index({ url }: { url: string }) {
    return <div className="d-flex flex-column align-items-center pt-2" >
        <div>
            <h1>Writeups</h1>
        </div>
        <div>
            <Link to={`${url}/picoCTF2021`} >picoCTF 2021</Link>
        </div>
    </div>
}

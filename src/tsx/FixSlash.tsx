import { useHistory, useLocation } from "react-router";

export default function FixSlash() {
    const location = useLocation();
    const history = useHistory();
    const url = location.pathname;
    if (url.charAt(url.length - 1) === "/" && url.length > 1) {
        history.push(url.substring(0, url.length - 1));
    }

    return null;
}
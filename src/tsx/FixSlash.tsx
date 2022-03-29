import { useNavigate, useLocation } from "react-router";

export default function FixSlash() {
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname;
    if (url.charAt(url.length - 1) === "/" && url.length > 1) {
        navigate(url.substring(0, url.length - 1));
    }

    return null;
}
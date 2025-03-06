import { Inconsolata } from "next/font/google";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const schibstedGrotesk = Inconsolata({
    weight: ["400", "700"],
    subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <div className={`${schibstedGrotesk.className}`}>
            <Component {...pageProps} />
        </div>
    );
};

export default api.withTRPC(MyApp);

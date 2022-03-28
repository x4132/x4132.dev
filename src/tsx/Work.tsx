import React from "react";

import rickroll from "../img/rickroll.png";
import areaselector from "../img/areaselector.png";
import abcabacus from "../img/abcabacus.png";
import cesium from "../img/cesium.png";

import Navbar from "./Navbar";

export default function Work() {
    return (
        <>
            <Navbar />
            <div className="d-flex flex-column text-center pt-2">
                <div className="pt-4" >
                    <h1>Work</h1>
                </div>

                <div className="container" >
                    <div className="row" >
                        <div className="col-md" >
                            <Project name="remoteRickroll" image={rickroll} link="https://github.com/x4132/remoteRickroll" />
                        </div>
                        <div className="col-md" >
                            <Project name="3D Area Selector" image={areaselector} link="https://www.qmine3d.com/product/custom-area/" />
                        </div>
                    </div>
                    <div className="row" >
                        <div className="col-md" >
                            <Project name="ABC Abacus" image={abcabacus} link="https://alibabaabacus.com/" />
                        </div>
                        <div className="col-md" >
                            <Project name="3D Model Creator" image={cesium} link="https://qmineviewer.vercel.app/" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function Project({ name, image, link }: { name: string, image: string, link: string }) {
    return <div className="d-flex flex-column pt-4 align-items-center" >
        <div>
            <h1>{name}</h1>
        </div>
        <div className="pt-2" >
            <a href={link} target="_blank" rel="noreferrer" ><img src={image} className="w-100 h-100" /></a>
        </div>
    </div>
}
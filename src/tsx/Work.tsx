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
                    <h1>Portfolio</h1>
                </div>

                <div className="mt-2" >

                </div>

                <div className="container mb-4" >
                    <div className="row" >
                        <div className="col-md" >
                            <Project name="3D Area Selector" image={areaselector} link="https://www.qmine3d.com/product/custom-area/" description="Allows customers to graphically select and order a 3D Terrain Print" />
                        </div>
                        <div className="col-md" >
                            <Project name="3D Model Creator" image={cesium} link="https://qmineviewer.vercel.app/" description="Custom application to create 3D scenes and share/present them" />
                        </div>
                    </div>
                    <div className="row" >
                        <div className="col-md" >
                            <Project name="ABC Abacus" image={abcabacus} link="https://alibabaabacus.com/" description="A math trainer for mental and abacus-based math" />
                        </div>

                        <div className="col-md" >
                            <Project name="remoteRickroll" image={rickroll} link="https://github.com/x4132/remoteRickroll" description="Websocket demo to broadcast an action from one computer to another" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function Project({ name, image, link, description }: { name: string, image: string, link: string, description: string }) {
    return <div className="d-flex flex-column pt-4 align-items-center" >
        <div>
            <h1>{name}</h1>
        </div>
        <div>
            {description}
        </div>
        <div className="pt-2" >
            <a href={link} target="_blank" rel="noreferrer" ><img src={image} className="w-100 h-100" /></a>
        </div>
    </div>
}
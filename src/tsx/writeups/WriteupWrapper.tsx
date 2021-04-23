import React from "react";

export default function WriteupWrapper({ children, heading }: { children: any, heading: string }) {
    return (
        <div className="d-flex justify-content-center" >
            <div className="d-flex flex-column align-items-center mt-2 w-50" >
                <div className="mt-2">
                    <h1>{heading}</h1>
                </div>
                {children}
            </div>
        </div>
    )
}
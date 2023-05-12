import React from "react";

export default function Container({children, className}) {
    return (<div className={"max-w-screen-x1 mx-auto" + className}>{children}
    </div>
);
}
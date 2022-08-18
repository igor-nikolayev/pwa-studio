import React from "react";

const hi = {
    textAlign: "center",
    margin: "1rem",
};
const wave = {
    ...hi,
    fontSize: "5rem",
};

const DemoPage = () => {
    return (
        <div>
            <h1 style={hi}>Hello, it is Demo page!</h1>
            <h1 style={wave}>{"\uD83D\uDC4B"}</h1>
        </div>
    );
};

export default DemoPage;

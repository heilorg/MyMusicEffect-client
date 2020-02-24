import React, { Component } from "react";
import "../style/equalizer.css";

class Equalizer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { dataArr } = this.props;
        if (dataArr === null) dataArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let viewData = [];
        for (let i = 0; i < 10; i++) {
            viewData[i] = dataArr[i];
        }

        return (
            <div className="equalizer-container">
                <div className="equalizer-viewer">
                    {viewData.map((element, idx) =>
                        idx < 10 ? (
                            <div
                                className="viewer-item"
                                key={idx}
                                style={{ height: `${(element / 256) * 100}%` }}
                            ></div>
                        ) : null
                    )}
                </div>
            </div>
        );
    }
}

export default Equalizer;

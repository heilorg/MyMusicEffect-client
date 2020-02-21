import React, { Component } from "react";
import "../style/progress.css";

class Progress extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { currentTime, duration } = this.props;
        return (
            <div className="progress-container">
                <div className="progress">
                    <div
                        className="progress-bar"
                        style={{ width: (currentTime / duration) * 100 + "%" }}
                    ></div>
                </div>
            </div>
        );
    }
}

export default Progress;

import React, { Component } from "react";
import "../style/progress.css";

class Progress extends Component {
    constructor(props) {
        super(props);

        this.changeTime = this.changeTime.bind(this);
    }

    changeTime(event) {
        event.persist();
        console.log(event);
        this.props.changeTime(
            ((event.clientX - event.target.offsetLeft) /
                event.target.clientWidth) *
                this.props.duration
        );
    }

    render() {
        let { currentTime, duration } = this.props;
        return (
            <div className="progress-container">
                <div className="progress" onClick={this.changeTime}>
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

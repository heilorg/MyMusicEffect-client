import React, { Component } from "react";
import { MdAdd } from "react-icons/md";
import "../style/home.css";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { name: "" };

        this.handleLogout = this.handleLogout.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
    }

    handleLogout() {
        fetch("api/user/logout", { method: "POST" })
            .catch(err => {
                console.log(err);
                alert("예기치 못한 오류 발생");
            })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    alert("성공적으로 로그아웃되었습니다.");
                    window.location = "/";
                }
            });
    }

    onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    onFileDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        event.persist();

        console.log(event);
    }

    componentDidMount() {
        fetch("api/getInfo")
            .catch(err => {
                console.log(err);
            })
            .then(res => res.json())
            .then(res => {
                if (res.error === 0) {
                    alert(
                        "로그인을 하시지 않으면 서비스를 이용하실 수 없습니다."
                    );
                    window.location = "/";
                } else if (res.user !== undefined) {
                    let name = res.user.name;
                    this.setState({ name });
                }
            });
    }

    render() {
        let name = this.state.name;
        return (
            <div className="main-container">
                <div className="music-owner">
                    <h1>{name}'s Music</h1>
                    <button onClick={this.handleLogout}>로그아웃</button>
                </div>
                <div className="player">
                    <div
                        className="music-list"
                        onDragOver={this.onDragOver}
                        onDrop={this.onFileDrop}
                    >
                        <div className="list-item">
                            <div>music name</div>
                            <div>other data</div>
                        </div>
                        <div className="list-item">
                            <div>music name</div>
                            <div>other data</div>
                        </div>
                        <div className="list-item">
                            <div>music name</div>
                            <div>other data</div>
                        </div>
                        <div className="list-item add-item">
                            <MdAdd />
                            <input type="file" />
                        </div>
                    </div>
                    <div className="effecter"></div>
                </div>
            </div>
        );
    }
}

export default Home;

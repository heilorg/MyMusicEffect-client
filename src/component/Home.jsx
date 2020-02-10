import React, { Component } from "react";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { name: "" };

        this.handleLogout = this.handleLogout.bind(this);
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
            <div>
                {name}'s Music
                <button onClick={this.handleLogout}>로그아웃</button>
            </div>
        );
    }
}

export default Home;

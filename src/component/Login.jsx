import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../style/login.css";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            password: ""
        };

        this.handleIdChange = this.handleIdChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleIdChange(event) {
        this.setState({
            id: event.target.value
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let user = {
            id: this.state.id,
            password: this.state.password
        };
        fetch("/api/user/login", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                switch (res.code) {
                    case 0:
                        alert(
                            "서버에 문제가 발생하였습니다. 잠시만 기다려 주시기 바랍니다."
                        );
                        break;
                    case 1:
                        alert("로그인 실패");
                        break;
                    case 2:
                        alert("해당 아이디의 유저가 존재하지 않습니다.");
                        break;
                    case 3:
                        alert("패스워드가 일치하지 않습니다.");
                        break;
                    default:
                        if (res.success !== undefined && res.success) {
                            alert("성공적으로  로그인되었습니다.");
                            window.location.href = "/home";
                        } else {
                            alert("예기치 못한 오류 발생");
                        }
                        break;
                }
            });
    }

    render() {
        return (
            <div className="form-container">
                <div className="form-heading">
                    <h1>로그인</h1>
                </div>

                <form onSubmit={this.handleSubmit} className="form-main">
                    <div className="form-item">
                        <label for="userid">아이디 :</label>
                        <input
                            type="text"
                            value={this.state.id}
                            onChange={this.handleIdChange}
                            id="userid"
                        />
                    </div>

                    <div className="form-item">
                        <label for="userpass">패스워드 :</label>
                        <input
                            type="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            id="userpass"
                        />
                    </div>

                    <div className="form-item">
                        <button>로그인</button>
                    </div>
                </form>

                <Link to="/register" className="form-otherlink">
                    회원가입
                </Link>
            </div>
        );
    }
}

export default Login;

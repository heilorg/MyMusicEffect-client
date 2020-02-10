import React, { Component } from "react";
import { Link } from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            password: "",
            name: ""
        };

        this.handleIdChange = this.handleIdChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
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

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let user = {
            id: this.state.id,
            password: this.state.password,
            name: this.state.name
        };
        fetch("/api/user/create", {
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
                        alert(
                            "아이디는 영어, 숫자 1글자 이상으로만 가능합니다."
                        );
                        break;
                    case 2:
                        alert("패스워드는 4글자 이상으로만 가능합니다.");
                        break;
                    case 3:
                        alert("이름은 영어, 한글 한글자 이상입니다.");
                        break;
                    case 4:
                        alert("해당 아이디의 유저가 이미 존재합니다.");
                        break;
                    default:
                        if (res.success !== undefined && res.success) {
                            alert("성공적으로  회원가입되었습니다.");
                            window.location.href = "/";
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
                <form onSubmit={this.handleSubmit} className="form-main">
                    <label>
                        id :
                        <input
                            type="text"
                            value={this.state.id}
                            onChange={this.handleIdChange}
                        />
                    </label>
                    <label>
                        password :
                        <input
                            type="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                        />
                    </label>

                    <label>
                        name :
                        <input
                            type="text"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                        />
                    </label>

                    <button>Submit</button>
                </form>

                <Link to="/">로그인</Link>
            </div>
        );
    }
}

export default Register;

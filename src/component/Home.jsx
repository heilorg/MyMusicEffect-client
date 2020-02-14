import React, { Component } from "react";
import {
    MdAdd,
    MdPlayArrow,
    MdStop,
    MdSkipPrevious,
    MdSkipNext,
    MdPause
} from "react-icons/md";
import "../style/home.css";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { name: "", songs: [] };

        this.handleLogout = this.handleLogout.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.musicPlay = this.musicPlay.bind(this);
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

        let loadSongs = event.dataTransfer.files;
        let songs = [];
        for (let i = 0; i < loadSongs.length; i++) {
            let song = loadSongs[i];
            if (song.type.substring(0, 5) !== "audio") {
                alert("음악파일만 업로드 가능합니다.");
                continue;
            }

            let songURL = URL.createObjectURL(song);
            let songData = { title: song.name, data: songURL };
            songs.push(songData);
            fetch("api/song/add", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(songData)
            })
                .catch(err => {
                    console.log(err);
                    alert("잘못된 파일입니다.");
                })
                .then(res => res.json())
                .then(console.log("추가 완료"));
        }
        let state = this.state.songs;
        this.setState({
            songs: state.concat(songs)
        });
    }

    musicPlay() {
        let song = new Audio();
        song.src = this.state.songs[0].data;
        song.play();
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
                    fetch("api/song/get")
                        .catch(err => {
                            console.log(err);
                        })
                        .then(res => res.json())
                        .then(res => {
                            this.setState({ songs: res });
                        });
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
                        {this.state.songs.map((song, idx) => (
                            <div className="list-item" key={idx}>
                                <div>{song.title}</div>
                            </div>
                        ))}
                        <div className="list-item add-item">
                            <MdAdd />
                            <input type="file" />
                        </div>
                    </div>
                    <div className="effecter">
                        <div className="effect-tool">
                            <div className="effect-tool-button">
                                <button>
                                    <MdSkipPrevious />
                                </button>
                                <button onClick={this.musicPlay}>
                                    <MdPlayArrow />
                                </button>
                                <button>
                                    <MdPause />
                                </button>
                                <button>
                                    <MdStop />
                                </button>
                                <button>
                                    <MdSkipNext />
                                </button>
                            </div>
                            <div className="effect-tool-progress">div</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

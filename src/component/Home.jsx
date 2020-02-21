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
import Progress from "./Progress";

let AUDIO;

const STATUS = {
    PLAY: 0,
    PAUSE: 1
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            songs: [],
            currentTime: 0,
            duration: 1,
            nowSong: 0,
            audioStatus: STATUS.PAUSE
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.addMusic = this.addMusic.bind(this);
        this.getMusic = this.getMusic.bind(this);
        this.musicPlay = this.musicPlay.bind(this);
        this.musicPause = this.musicPause.bind(this);
        this.musicStop = this.musicStop.bind(this);
        this.musicEnd = this.musicEnd.bind(this);
        this.audioData = this.audioData.bind(this);
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
            if (song.type.substring(6) !== "mp3") {
                alert(".mp3 파일만 업로드 가능합니다.");
                continue;
            }

            let songData = {
                title: song.name,
                path: URL.createObjectURL(song)
            };
            songs.push(songData);

            if (this.state.songs.length === 0) {
                AUDIO.src = songData.path;
            }

            let formData = new FormData();
            formData.append("title", song.name);
            formData.append("data", song);
            fetch("api/song/add", {
                method: "POST",
                body: formData
            })
                .catch(err => {
                    console.log(err);
                    alert("잘못된 파일입니다.");
                })
                .then(res => res.json())
                .then(res => {
                    console.log("추가 완료");
                });
        }
        let state = this.state.songs;
        this.setState({
            songs: state.concat(songs)
        });
    }

    addMusic() {
        // event.persist();
        let fileLoader = document.createElement("input");
        fileLoader.type = "file";
        fileLoader.addEventListener("change", event => {
            let song = event.target.files[0];
            if (song.type.substring(0, 5) !== "audio") {
                alert("음악파일만 업로드 가능합니다.");
                return;
            }
            console.log(song.type.substring(6));
            if (song.type.substring(6) !== "mp3") {
                alert(".mp3 파일만 업로드 가능합니다.");
                return;
            }

            let songData = {
                title: song.name,
                path: URL.createObjectURL(song)
            };
            if (this.state.songs.length === 0) {
                AUDIO.src = songData.path;
            }
            let formData = new FormData();
            formData.append("title", song.name);
            formData.append("data", song);
            fetch("api/song/add", {
                method: "POST",
                body: formData
            })
                .catch(err => {
                    console.log(err);
                    alert("잘못된 파일입니다.");
                })
                .then(res => res.json())
                .then(res => {
                    console.log("추가 완료");
                    this.setState({
                        songs: this.state.songs.concat(songData)
                    });
                });
        });
        fileLoader.click();
    }

    getMusic(res) {
        let name = res.user.name;
        this.setState({ name });
        fetch("api/song/get")
            .catch(err => {
                console.log(err);
            })
            .then(res => res.json())
            .then(res => {
                this.setState({ songs: res });
                this.audioSet(res);
            });
    }

    musicPlay() {
        if (this.state.songs.length === 0) return false;
        if (this.state.songs[0].path.substring(0, 4) === "blob") {
            AUDIO.src = this.state.songs[0].path;
        } else {
            AUDIO.src = "/" + this.state.songs[0].path;
        }

        AUDIO.play();
        this.setState({
            audioStatus: STATUS.PLAY
        });
    }

    musicPause() {
        AUDIO.pause();
        this.setState({
            audioStatus: STATUS.PAUSE
        });
    }

    musicStop() {
        console.log("click");
        AUDIO.pause();
        AUDIO.currentTime = 0;
        this.setState({
            audioStatus: STATUS.PAUSE
        });
    }

    musicEnd() {
        let { songs, nowSong } = this.state;

        AUDIO.src = songs[++nowSong].path;
        AUDIO.play();
        this.setState({ nowSong });
    }

    audioSet(res) {
        AUDIO = new Audio();
        AUDIO.addEventListener("ended", this.musicEnd);
        if (res.length > 0) {
            AUDIO.src = res[0].path;
        }
        requestAnimationFrame(this.audioData);
    }

    audioData() {
        let { currentTime, duration } = AUDIO;
        this.setState({
            currentTime,
            duration
        });
        requestAnimationFrame(this.audioData);
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
                    this.getMusic(res);
                }
            });
    }

    render() {
        let { name, currentTime, duration, audioStatus } = this.state;
        duration = isNaN(duration) ? 0 : duration;
        let printTime = {
            currentTimeM:
                Math.round(currentTime / 60) < 10
                    ? "0" + Math.round(currentTime / 60)
                    : Math.round(currentTime / 60),
            currentTimeS:
                Math.round(currentTime % 60) < 10
                    ? "0" + Math.round(currentTime % 60)
                    : Math.round(currentTime % 60),
            durationM:
                Math.round(duration / 60) < 10
                    ? "0" + Math.round(duration / 60)
                    : Math.round(duration / 60),
            durationS:
                Math.round(duration % 60) < 10
                    ? "0" + Math.round(duration % 60)
                    : Math.round(duration % 60)
        };
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
                        <div
                            className="list-item add-item"
                            onClick={this.addMusic}
                        >
                            <MdAdd />
                        </div>
                        {this.state.songs.map((song, idx) => (
                            <div className="list-item" key={idx}>
                                <div>{song.title}</div>
                            </div>
                        ))}
                    </div>
                    <div className="effecter">
                        <div className="effect-tool">
                            <div className="effect-tool-button">
                                <button>
                                    <MdSkipPrevious />
                                </button>
                                {audioStatus === STATUS.PAUSE ? (
                                    <button onClick={this.musicPlay}>
                                        <MdPlayArrow />
                                    </button>
                                ) : null}
                                {audioStatus === STATUS.PLAY ? (
                                    <button onClick={this.musicPause}>
                                        <MdPause />
                                    </button>
                                ) : null}
                                <button onClick={this.musicStop}>
                                    <MdStop />
                                </button>
                                <button onClick={this.musicEnd}>
                                    <MdSkipNext />
                                </button>
                            </div>
                            <div>
                                {printTime.currentTimeM}:
                                {printTime.currentTimeS} {printTime.durationM}:
                                {printTime.durationS}
                            </div>
                            <Progress
                                currentTime={currentTime}
                                duration={duration}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

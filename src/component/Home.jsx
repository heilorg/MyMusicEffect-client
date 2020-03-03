import React, { Component } from "react";
import {
    MdAdd,
    MdPlayArrow,
    MdStop,
    MdSkipPrevious,
    MdSkipNext,
    MdPause,
    MdDelete
} from "react-icons/md";
import "../style/home.css";
import Progress from "./Progress";
import Equalizer from "./Equalizer";

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
            audioStatus: STATUS.PAUSE,
            analyser: null,
            dataArr: null
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
        this.musicNext = this.musicNext.bind(this);
        this.musicPrevious = this.musicPrevious.bind(this);
        this.musicSelect = this.musicSelect.bind(this);
        this.musicDelete = this.musicDelete.bind(this);
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
        for (let i = 0; i < loadSongs.length; i++) {
            let song = loadSongs[i];
            this.musicUpload(song);
        }
    }

    addMusic() {
        let fileLoader = document.createElement("input");
        fileLoader.type = "file";
        fileLoader.addEventListener("change", event => {
            let song = event.target.files[0];
            this.musicUpload(song);
        });
        fileLoader.click();
    }

    musicUpload(song) {
        if (song.type.substring(0, 5) !== "audio") {
            alert("음악파일만 업로드 가능합니다.");
            return false;
        }
        if (song.type.substring(6) !== "mp3") {
            alert(".mp3 파일만 업로드 가능합니다.");
            return false;
        }

        let songData = {
            title: song.name,
            path: URL.createObjectURL(song)
        };
        let formData = new FormData();
        formData.append("title", song.name);
        formData.append("data", song);
        fetch("api/song/add", {
            method: "POST",
            body: formData
        })
            .catch(err => {
                console.log(err);
                songData = false;
                alert("잘못된 파일입니다.");
            })
            .then(res => res.json())
            .then(res => {
                console.log("추가 완료");

                if (this.state.songs.length === 0) {
                    this.musicChange(songData.path);
                }
                this.setState({
                    songs: this.state.songs.concat(songData)
                });
            });
        return songData;
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
        let { songs } = this.state;
        if (songs.length === 0) return false;

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
        AUDIO.pause();
        AUDIO.currentTime = 0;
        this.setState({
            audioStatus: STATUS.PAUSE
        });
    }

    musicEnd() {
        this.musicNext();
    }

    musicNext() {
        let { songs, nowSong } = this.state;

        let nextSong = nowSong + 1;

        if (nextSong > songs.length - 1) {
            nextSong = 0;
        }

        this.musicChange(songs[nextSong].path);
        this.setState({ nowSong: nextSong });
    }

    musicPrevious() {
        let { songs, nowSong } = this.state;
        let prevSong = nowSong - 1;

        if (prevSong < 0) {
            prevSong = songs.length - 1;
        }

        this.musicChange(songs[prevSong].path);
        this.setState({ nowSong: prevSong });
    }

    musicSelect(index) {
        let { songs } = this.state;

        this.musicChange(songs[index].path);
        this.setState({ nowSong: index });
    }

    musicDelete() {
        let { songs, nowSong } = this.state;
        fetch("/api/song/delete/" + songs[nowSong]._id, {
            method: "delete"
        })
            .catch(err => {
                console.log(err);
            })
            .then(res => res.json())
            .then(res => {
                alert("성공적으로 삭제되었습니다.");
                songs = songs.filter((item, idx) => idx !== nowSong);
                nowSong = nowSong === songs.length - 2 ? 0 : nowSong;

                this.musicChange(songs[nowSong].path);
                this.setState({ songs, nowSong });
            });
    }

    musicChange(path) {
        let { audioStatus } = this.state;
        AUDIO.pause();
        AUDIO = new Audio();
        AUDIO.src = path;
        if (audioStatus === STATUS.PLAY) {
            AUDIO.play();
        }
        let aCtx = new AudioContext();
        let src = aCtx.createMediaElementSource(AUDIO);
        const analyser = aCtx.createAnalyser();
        src.connect(aCtx.destination);
        src.connect(analyser);
        analyser.fftSize = 32;

        const bufferLength = analyser.frequencyBinCount;
        let dataArr = new Uint8Array(bufferLength);

        this.setState({ analyser, dataArr });
    }

    changeTime(time) {
        AUDIO.currentTime = time;
    }

    audioSet(res) {
        AUDIO = new Audio();
        AUDIO.addEventListener("ended", this.musicEnd);
        if (res.length > 0) {
            this.musicChange(res[0].path);
        }
        this.audioData();
    }

    audioData() {
        let { currentTime, duration } = AUDIO;
        let { analyser, dataArr } = this.state;
        if (analyser !== null) {
            analyser.getByteFrequencyData(dataArr);
        }
        this.setState({
            currentTime,
            duration,
            dataArr
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
        let {
            name,
            currentTime,
            duration,
            audioStatus,
            nowSong,
            dataArr
        } = this.state;
        duration = duration || 0;
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
                            <div
                                className={`list-item ${
                                    idx == nowSong ? "active" : ""
                                }`}
                                key={idx}
                                onDoubleClick={() => this.musicSelect(idx)}
                            >
                                <div>{song.title}</div>
                            </div>
                        ))}
                    </div>
                    <div className="effector">
                        <div className="effect-tool">
                            <div className="effect-tool-button">
                                <div className="left-container">
                                    <button onClick={this.musicPrevious}>
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
                                    <button onClick={this.musicNext}>
                                        <MdSkipNext />
                                    </button>
                                    <span className="time-container">
                                        {printTime.currentTimeM}:
                                        {printTime.currentTimeS}{" "}
                                        {printTime.durationM}:
                                        {printTime.durationS}
                                    </span>
                                </div>

                                <button
                                    className="delete-btn"
                                    onClick={this.musicDelete}
                                >
                                    <MdDelete />
                                </button>
                            </div>

                            <Progress
                                currentTime={currentTime}
                                duration={duration}
                                changeTime={this.changeTime}
                            />
                        </div>

                        <Equalizer dataArr={dataArr}></Equalizer>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

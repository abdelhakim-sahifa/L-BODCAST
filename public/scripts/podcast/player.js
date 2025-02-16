
    const audio = document.getElementById("audio");
    const progress = document.getElementById("progress");
    const playIcon = document.getElementById("playIcon");
    let isPlaying = false;
    document.querySelector(".fa-xmark").addEventListener('click'
        , ()=> {
            const playerBody = document.querySelector('.body')
            playerBody.style.bottom = "-100vh"
        }
    )
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            playIcon.classList.remove("fa-pause");
            playIcon.classList.add("fa-play");
        } else {
            audio.play();
            playIcon.classList.remove("fa-play");
            playIcon.classList.add("fa-pause");
        }
        isPlaying = !isPlaying;
    }
    function rewind() {
        audio.currentTime -= 10;
    }
    function fastForward() {
        audio.currentTime += 10;
    }
    audio.addEventListener("timeupdate", () => {
        progress.value = audio.currentTime;
    });
    progress.addEventListener("input", () => {
        audio.currentTime = progress.value;
    });


    document.getElementById('rewindButton').addEventListener('click'
        , rewind
    )
    document.getElementById('playButton').addEventListener('click'
        , togglePlay
    )
    document.getElementById('fastForwardButton').addEventListener('click'
        , fastForward
    )
            





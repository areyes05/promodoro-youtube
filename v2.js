const STATE = {
    NOT_APPENDED: 'Not appended',
    IDLE: 'Idle',
    WORKING: 'Working',
    PREPARE_FOR_BREAK: 'Preparing for break',
    BREAK: 'Break',
};
const minutesWorking = 23;
const minutesToPrepareForBreak = 1;
const minutesInBreak = 4;
const SECONDS_IN_A_MINUTE = 60;
const info = document.createElement('button');
let state = STATE.NOT_APPENDED;
let playSound = async () => new Audio('https://kids.hiddetek.com/audio/notification_simple-01.wav').play();
let nowSeconds = () => (new Date().getTime() / 1000) >> 0;
let referenceTime = nowSeconds();
let threshold = nowSeconds() + 24 * SECONDS_IN_A_MINUTE;
let titleDOM;
let ytBtn;

const formatTime = totalSeconds => {
    const prep = num => num < 10 ? `0${num}` : num;
    const minutes = totalSeconds / 60 >> 0;
    const seconds = totalSeconds % 60 >> 0;
    return ` ${prep(minutes)}:${prep(seconds)}`;
};

let nextStatus = () => {
    const updateState = (newState, newThreshold) => {
        referenceTime = nowSeconds();
        threshold = nowSeconds() + newThreshold * SECONDS_IN_A_MINUTE;
        state = newState;
        playSound().then();
    }

    const clickPlay = () => {
        if (!ytBtn) {
            ytBtn = document.querySelector(".ytp-play-button.ytp-button") || document.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button');
        }
        ytBtn.click();
    }

    switch (state) {
        case STATE.IDLE:
            updateState(STATE.WORKING, minutesWorking);
            break;
        case STATE.WORKING:
            updateState(STATE.PREPARE_FOR_BREAK, minutesToPrepareForBreak);
            break;
        case STATE.PREPARE_FOR_BREAK:
            updateState(STATE.BREAK, minutesInBreak);
            clickPlay();
            break;
        case STATE.BREAK:
            updateState(STATE.WORKING, minutesWorking);
            clickPlay();
            break;
    }
}
info.onclick = () => nextStatus();

/** MAIN **/
let program = () => {
    if (state === STATE.NOT_APPENDED) {
        titleDOM = document.querySelector("#title > h1") || document.querySelector('#container > h1 > yt-formatted-string');
        if (titleDOM) {
            titleDOM.appendChild(info);
            state = STATE.IDLE;
            info.innerText = ' ready';
        }
        return;
    }
    if (state === STATE.IDLE) {
        return;
    }
    const countDown = formatTime(threshold - nowSeconds())
    info.innerText = ` ${state} ${countDown}`;
    if (nowSeconds() > threshold) {
        nextStatus();
    }
}

const waitASecond = () => {
    return new Promise(res => {
        setTimeout(res, 1000);
    });
};
let isRunning = true;
let clock = async () => {
    while (isRunning) {
        await waitASecond();
        program()
    }
};

clock();

document.addEventListener("DOMContentLoaded", () =>{

  const wait = () => {
    return new Promise(res => {
      setTimeout(res, 1000);
    });
  }

  // get current time
  const now = () => Math.round(Date.now() / 1000);
  let workingTime = (24 * 60 + 0);
  let restingTime = (4 * 60 + 0);
  let isWorking = true;

  let initialTime = now();

  // recurse each second
  const transpiredTime = action => {
      const time = isWorking ? workingTime : restingTime;
      if (now() >= initialTime + time) {
          isWorking = !isWorking;
          initialTime = now();
          action();
      }
      return initialTime + time - now();
  };

  const formatTime = totalSeconds => {

      const prep = num => num < 10 ? `0${num}` : num;
      const minutes = totalSeconds / 60 >> 0;
      const seconds = totalSeconds % 60 >> 0;

      return ` ${prep(minutes)}:${prep(seconds)}`;
  };

  const audioFileUrl = 'https://kids.hiddetek.com/audio/notification_simple-01.wav';
  const ytBtn = document.querySelector(".ytp-play-button.ytp-button");
  const ytClick = async () => {
    await new Audio(audioFileUrl).play();
    ytBtn.click();
    await new Audio(audioFileUrl).play();
  };

  const el = document.createElement('span');
  el.innerText=" Alex";

  let titleDom;
  const setTitleDom = async () => {
    while (!titleDom) {
      await wait();
      titleDom = document.querySelector("#container > h1 > yt-formatted-string");
    }
    titleDom.appendChild(el);
  };
  setTitleDom();
  

  const write = () => {
    const time = transpiredTime(ytClick);
    const status = isWorking ? "Working" : "Break"
    el.innerText = formatTime(time) + " " + status;
  }

  let intr;
  let playing = false;
  const play = () => { intr = setInterval(write, 1000); };
  const pause= () => { clearInterval(intr); };

  const adjustTime = timeInSeconds => {
    const timeContext = isWorking ? workingTime : restingTime;
    initialTime = now() - (timeContext - timeInSeconds);
  }

  el.onclick = () => {
    const action = playing ? pause : play;
    action();
    playing = !playing;
  };

});

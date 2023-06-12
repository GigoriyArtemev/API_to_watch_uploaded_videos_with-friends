export const wsConnection = new WebSocket("ws://192.168.0.118:8999");
var vid = document.getElementById("videoPlayer111");
let pause = new Boolean(true);
vid.addEventListener("pause", (event) => {
  // console.log("пауза");
  pause = true;
});
vid.addEventListener("play", (event) => {
  //console.log("играет дальше");
  pause = false;
});
vid.addEventListener("seeked", (event) => {
  console.log("пользователь переместил ползунок");
  vid.pause();
});
vid.addEventListener(
  "timeupdate",
  function () {
    // console.log(`текущее время: ${typeof vid.currentTime}`);
  },
  false
);
wsConnection.onopen = function () {
  console.log("Соединение установлено.");
  let link = document.location.href.substring(28);
  console.log(link);
  wsConnection.send("new" + link);
  vid.onpause = function () {
    wsConnection.send("pause" + link);
  };
  vid.onplay = function () {
    wsConnection.send("play" + link);
  };
  vid.onseeked = function () {
    vid.onmousedown = function () {
      let message = ["time", vid.currentTime.toFixed(2), link];
      wsConnection.send(message);
    };
  };
};

wsConnection.onclose = function (event) {
  if (event.wasClean) {
    console.log("Соединение закрыто чисто");
  } else {
    console.log("Обрыв соединения"); // например, "убит" процесс сервера
  }
  console.log("Код: " + event.code + " причина: " + event.reason);
};

wsConnection.onerror = function (error) {
  console.log("Ошибка " + error.message);
};

export const wsSend = function (data) {
  // readyState - true, если есть подключение
  if (!wsConnection.readyState) {
    setTimeout(function () {
      wsSend(data);
    }, 100);
  } else {
    wsConnection.send(data);
  }
};
wsConnection.onmessage = function (event) {
  let message = event.data;
  console.log(message);
  if (message == "pause!") {
    vid.pause();
  }
  if (message == "play!") {
    vid.play();
  }
  if (message.substring(0, 5) == "time!") {
    console.log(message);
    vid.currentTime = Number(message.substring(5));
  }
};

import * as util from '../component/util.js';

let pomodoro;
let onTimeoutNotificationId = "onTimeoutNotificationId";


/*
  Run initialization once when browser starts. 
*/
async function init() {
  browser.runtime.onMessage.addListener(handleMessage);
}

async function updateUI() {
  const text = util.isEmptyObject(pomodoro) ? "" : util.MMSS(pomodoro.timeLeft);
  browser.browserAction.setBadgeText({ text: text });
  browser.runtime.sendMessage({ id: "TICK", pomodoro : pomodoro });
}

async function onTimeout() {
  stopTimer();

  let options = {
    type: "basic",
    iconUrl: browser.runtime.getURL("../asset/icons8-tomato-48.png"),
    title: "Pomodoro!",
    message: "",
    buttons: ["Short break", "Long break"]
  };

  if (pomodoro.task === "WORK") {
    browser.notifications.create(onTimeoutNotificationId, options);
  browser.notifications.onButtonClicked.addListener(onNotificationButtonClicked);
  }
}

async function onNotificationButtonClicked(notificationId, buttonIndex) {
  if (buttonIndex === 0) {
    startTimer(5 * 60 * 1000, "SHORT_BREAK")
  } else {
    startTimer(30 * 60 * 1000, "SHORT_BREAK")
  }
}

async function onInterval() {
  pomodoro.timeLeft = pomodoro.endTime - new Date(); 
  updateUI();
}

async function startTimer(duration, task) {
  let _endTime = new Date();
  _endTime.setMilliseconds(_endTime.getMilliseconds() + duration + 1000);

  if (pomodoro) {
    clearInterval(pomodoro.intervalId);
    clearTimeout(pomodoro.timeoutId);
  }

  let _intervalId = setInterval(onInterval, 1000);
  let _timeoutId = setTimeout(onTimeout, duration);

  pomodoro = {
    startTime : new Date(),
    endTime: _endTime,
    timeoutId: _timeoutId,
    intervalId: _intervalId,
    duration: duration, 
    timeLeft : duration, 
    task : task
  };

  browser.notifications.clear(onTimeoutNotificationId);
  console.log(`Timer started with duration ${duration}.`);
  updateUI();
}

async function stopTimer() {
  console.log("Timer stopped.");
  browser.notifications.clear(onTimeoutNotificationId);
  clearInterval(pomodoro.intervalId);
  clearTimeout(pomodoro.timeoutId);
  pomodoro = {};
  updateUI();
  let audio = new Audio('../asset/onTimeout.mp3');
  audio.play();
}

/* 
  Messages from popup or other modules are handled here.
*/
async function handleMessage(message) {
  switch (message.id) {
    case 'START_TIMER':
      startTimer(message.duration, message.task);
      break;
    case 'STOP_TIMER':
      stopTimer();
      break;
    default:
      throw new Error(`Message id "${message.id}" is not implementd.`)
  }
}

/* 
  On browser suspend
*/
browser.runtime.onSuspend.addListener(function () {
  stopTimer();
});


init();
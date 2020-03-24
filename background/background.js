import * as util from '../component/util.js';
import * as settings from '../component/settings.js';

let pomodoro;
let onTimeoutNotificationId = 'onTimeoutNotificationId';

/*
  Run initialization once when browser starts. 
*/
async function init() {
  browser.runtime.onMessage.addListener(handleMessage);
}

/* 
  Updat badget text and send message to Popup controller
*/
async function updateUI() {
  let color, text;

  if (pomodoro.timeLeft === 0) {
    color = "red";
    text = '';
  } else {
    color = pomodoro.task.indexOf('BREAK') > 0 ? "green" : "red";
    text = util.MMSS(pomodoro.timeLeft);
  }

  browser.browserAction.setBadgeText({ text: text });
  browser.browserAction.setBadgeBackgroundColor({ color: color });
}

/* 
  Notify the user that the alarm has ended
*/
async function onTimeout() {
  stopTimer();
  let options = {
    type: 'basic',
    iconUrl: browser.runtime.getURL('../asset/icons8-tomato-48.png'),
    title: 'Pomodoro!',
    message: 'Timer has ended.',
    buttons: []
  };


  if (pomodoro.task === 'WORK') {
    options.buttons = [{ title: 'Short break' }, { title: 'Long break' }];
  } else {
    options.buttons = [{ title: 'Pomodoro!' }];
  }

  browser.notifications.create(onTimeoutNotificationId, options);
  browser.notifications.onButtonClicked.addListener(onNotificationButtonClicked);
}

/* 
  Handle user response
*/
async function onNotificationButtonClicked(notificationId, buttonIndex) {
  var _settings = await settings.get();

  if (pomodoro.task === 'WORK') {
    if (buttonIndex === 0) {
      startTimer(_settings.duration.shortBreak, 'SHORT_BREAK');
    } else {
      startTimer(_settings.duration.longBreak, 'SHORT_BREAK');
    }
  } else {
    if (buttonIndex === 0) {
      startTimer(_settings.duration.work, 'WORK');
    }
  }
}

/* 
  Tick function  
*/
async function onInterval() {
  pomodoro.timeLeft = pomodoro.endTime - new Date();
  updateUI();
}

/* 
  Create a new pomodoro object and start it
*/
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
    startTime: new Date(),
    endTime: _endTime,
    timeoutId: _timeoutId,
    intervalId: _intervalId,
    duration: duration,
    timeLeft: duration,
    task: task
  };

  browser.notifications.clear(onTimeoutNotificationId);
  console.log(`Timer started. Duration: ${duration}`);
  updateUI();
}

/* 
  Stop the current running timer and reset the pomodoro object
*/
async function stopTimer() {
  browser.notifications.clear(onTimeoutNotificationId);
  clearInterval(pomodoro.intervalId);
  clearTimeout(pomodoro.timeoutId);
  pomodoro.timeLeft = 0;
  updateUI();
  let audio = new Audio('../asset/onTimeout.mp3');
  audio.play();
  console.log('Timer stopped.');
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
    case 'GET_POMODORO':
      browser.runtime.sendMessage({ id: 'POMODORO', pomodoro: pomodoro || {} });
      break;
    default:
      throw new Error(`Message id '${message.id}' is not implementd.`)
  }
}

/* 
  On browser suspend
*/
browser.runtime.onSuspend.addListener(function () {
  stopTimer();
});


init();
import * as settings from "../component/settings.js";

// Local copy of the global settings
let _settings;

// UI References
let UIRangeWorkDuration = document.getElementById("UIRangeWorkDuration");
let UIRangeShortBreakDuration = document.getElementById("UIRangeShortBreakDuration");
let UIRangeLongBreakDuration = document.getElementById("UIRangeLongBreakDuration");
let UIButtonReset = document.getElementById("UIButtonReset");
let UISoundEffectVolume = document.getElementById("UISoundEffectVolume");

/* 
    Event listeners
*/
async function initEventListeners() {
    UIRangeWorkDuration.addEventListener("change", onOptionsChanged);
    UIRangeShortBreakDuration.addEventListener("change", onOptionsChanged);
    UIRangeLongBreakDuration.addEventListener("change", onOptionsChanged);
    UISoundEffectVolume.addEventListener("change", onOptionsChanged);
    
    UIRangeWorkDuration.addEventListener("input", onWorkDurationChanged);
    UIRangeShortBreakDuration.addEventListener("input", onShortBreakDurationChanged);
    UIRangeLongBreakDuration.addEventListener("input", onLongBreakDurationChanged);
    UISoundEffectVolume.addEventListener("input", onSoundEffectVolumeChanged);

    UIButtonReset.addEventListener("click", resetSettings);
}

/* 
    Runs once during the initializtion
*/
async function init() {
    _settings = await settings.get();
    UIRangeWorkDuration.value = toMinutes(_settings.duration.work);
    UIRangeShortBreakDuration.value = toMinutes(_settings.duration.shortBreak);
    UIRangeLongBreakDuration.value = toMinutes(_settings.duration.longBreak);
    UISoundEffectVolume.value = _settings.volume;
    initEventListeners();
}

/* 
    Reset settings to default settings
*/
async function resetSettings() {
    await settings.reset();
    init();
}

/*
    Save new settings
*/
async function onOptionsChanged() {
    _settings.duration.work = toMilliseconds(UIRangeWorkDuration.value);
    _settings.duration.shortBreak = toMilliseconds(UIRangeShortBreakDuration.value);
    _settings.duration.longBreak = toMilliseconds(UIRangeLongBreakDuration.value);
    _settings.volume = UISoundEffectVolume.value;
    await settings.set(_settings);
}

function toMilliseconds(minutes) {
    return Number(minutes * 60 * 1000)
}

function toMinutes(milliseconds) {
    return Number(Math.round(milliseconds / 60 / 1000))
}

/* 
    Update label on duration slider change
*/
async function onWorkDurationChanged() {
    console.log(UIRangeWorkDuration.value);
}

async function onShortBreakDurationChanged() {
    console.log(UIRangeShortBreakDuration.value);
}

async function onLongBreakDurationChanged() {
    console.log(UIRangeLongBreakDuration.value);
}

async function onSoundEffectVolumeChanged() {
  console.log(UISoundEffectVolume.value);
}

init(); 
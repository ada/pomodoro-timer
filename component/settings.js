import { isEmptyObject } from "./util.js";

/* 
    Default settings when using the extension for the first time
*/
export const defaults = {
    duration: {
        work: 25 * 60 * 1000,
        shortBreak: 5 * 60 * 1000,
        longBreak: 30 * 60 * 1000
    }
}

/* 
    Set settings object
*/
export async function set(obj) {
    await browser.storage.sync.set({
        "settings": obj
    });
}

/* 
    Reset settings
*/
export async function reset() {
    await set(defaults);
}

/*
    Get settings object. Return default settings if no settings where found. 
*/
export async function get() {
    let obj = await browser.storage.sync.get(["settings"]);
    if (isEmptyObject(obj) === true) {
        await set(defaults);
        return defaults;
    }
    return obj.settings;
}
const secondsConstant = {
    seconds: 1,
    minutes: 60,
    hour: 3600,
    day: 86400
};

const timePlaceholder = {
    year: 'Y+',
    Q: 'Q+',
    month: 'M+',
    day: 'D+',
    hour: 'H+',
    minute: 'm+',
    seconds: 's+',
    milliseconds: 'S'
};

function replaceTimePlaceholder(placeholder: string[], values: number[], format: string) {
    placeholder.forEach((v, i) => {
        if (new RegExp('(' + v + ')').test(format)) {
            let value = values[i].toString();
            if (v === timePlaceholder.year) {
                format = format.replace(RegExp.$1, value.toString().substr(4 - RegExp.$1.length));
            } else {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? value : ("00" + value).substr(value.length));
            }
        }
    });
    return format;
}

const secondsFormatPlaceholder = [timePlaceholder.day, timePlaceholder.hour, timePlaceholder.minute, timePlaceholder.seconds];
export function secondsFormat(seconds: number, format: string = 'HH:mm:ss') {
    let d = Math.floor(seconds / secondsConstant.day);
    let h = Math.floor(seconds / secondsConstant.hour);
    let m = Math.floor(seconds / secondsConstant.minutes % secondsConstant.minutes);
    let s = Math.floor(seconds % secondsConstant.minutes);
    return replaceTimePlaceholder(secondsFormatPlaceholder, [d, h, m, s], format);
}

const dateFormatPlaceholder = [
    timePlaceholder.year, timePlaceholder.Q, timePlaceholder.month, timePlaceholder.day,
    timePlaceholder.hour, timePlaceholder.minute, timePlaceholder.seconds, timePlaceholder.milliseconds
];
export function dateFormat(date: Date, format: string) {
    const values: number[] = [
        date.getFullYear(),
        Math.floor((date.getMonth() + 3) / 3), //季度 
        date.getMonth() + 1, //月份 
        date.getDate(), //日 
        date.getHours(), //小时 
        date.getMinutes(), //分 
        date.getSeconds(), //秒 
        date.getMilliseconds() //毫秒 
    ];
    return replaceTimePlaceholder(dateFormatPlaceholder, values, format);
}

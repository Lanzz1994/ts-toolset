import { secondsFormat } from './time';

export function getFileDuration(file: File) {
    return new Promise((resolve) => {
        let url = URL.createObjectURL(file);
        let audioElement = new Audio(url);
        audioElement.addEventListener('loadedmetadata', _event => {
            resolve({
                duration: audioElement.duration,
                durationStr: secondsFormat(audioElement.duration)
            });
        });
    });
}
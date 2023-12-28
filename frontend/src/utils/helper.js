export function convertBytes(bytes) {
    const KB = 1024;
    const MB = 1024 * KB;

    if (bytes < KB) {
        return bytes + ' B';
    } else if (bytes < MB) {
        return (bytes / KB).toFixed(0) + ' KB';
    } else {
        return (bytes / MB).toFixed(2) + ' MB';
    }
}

//get percentage storage
export function getPercentageStorage(usedStorage, totalStorage) {
    return (usedStorage / totalStorage) * 100;
}
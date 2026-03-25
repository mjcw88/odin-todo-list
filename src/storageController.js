function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

export function saveToStorage(obj) {
    if (storageAvailable("localStorage")) {
        localStorage.setItem(`${obj.id}`, JSON.stringify(obj));
    } else {
        console.error("localStorage unavailable");
    }
}

export function loadAllFromStorage() {
    const objects = [];
    
    if (storageAvailable("localStorage")) {
        Object.keys(localStorage).forEach(key => {
            objects.push(JSON.parse(localStorage.getItem(key)));
        })
    } else {
        console.error("localStorage unavailable");
    }
    return objects;
}

export function fetchItem(id) {
    if (storageAvailable("localStorage")) {
        return JSON.parse(localStorage.getItem(`${id}`));
    } else {
        console.error("localStorage unavailable");
        return null;
    }
}
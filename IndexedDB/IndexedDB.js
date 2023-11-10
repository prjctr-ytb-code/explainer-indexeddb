export class IndexedDB {
    static storeName = 'state';

    constructor(dbName, dbVersion) {
        return new Promise((resolve, reject) => {
            this.db = null;

            if (!('indexedDB' in window)) {
                throw new Error('IndexedDB is not supported');
            }

            const dbOpen = indexedDB.open(dbName, dbVersion);

            dbOpen.onsuccess = () => {
                this.db = dbOpen.result;
                resolve(this);
            };

            dbOpen.onupgradeneeded = function (event) {
                const db = dbOpen.result;
                db.createObjectStore(IndexedDB.storeName);
            }

            dbOpen.onerror = (event) => {
                reject(`IndexedDB error: ${event.target.errorCode}`);
            };
        });
    }

    set(name, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(IndexedDB.storeName, 'readwrite');
            const store = transaction.objectStore(IndexedDB.storeName);
            store.put(value, name);

            transaction.oncomplete = () => {
                resolve(true);
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }

    get(name) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(IndexedDB.storeName, 'readonly');
            const store = transaction.objectStore(IndexedDB.storeName);
            const request = store.get(name);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(IndexedDB.storeName, "readwrite");
            const store = transaction.objectStore(IndexedDB.storeName);
            const request = store.openCursor();
            const allData = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    allData.push(
                        {
                            key: cursor.key,
                            value: cursor.value,
                        }
                    );
                    cursor.continue();
                } else {
                    resolve(allData);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    remove(name) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(IndexedDB.storeName, "readwrite");
            const store = transaction.objectStore(IndexedDB.storeName);
            const request = store.delete(name);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}

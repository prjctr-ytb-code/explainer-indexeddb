import {IndexedDB} from './IndexedDB/IndexedDB.js';
import {Table} from './components/Table.js';
import {mockData} from "./mock/mockData.js";

(async () => {
    const indexedDB = await new IndexedDB(['todolist'], 1);
    const form = document.querySelector('.form');
    const taskList = document.querySelector('#task-list');
    const readyState = document.readyState;

    for (const mockDataItem of mockData) {
        await indexedDB.set(mockDataItem.name, mockDataItem.task);
    }

    const renderTable = async () => {
        const tasks = await indexedDB.getAll();
        const table = new Table(tasks, taskList);
        table.render();
    }

    if (readyState === 'interactive' || readyState === "complete") {
        await renderTable();
    } else {
        window.addEventListener('load', async () => {
            await renderTable();
        });
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const formDataObject = {};
        data.forEach((value, key) => {
            formDataObject[key] = value;
        });
        await indexedDB.set(formDataObject.name, formDataObject.task);
        await renderTable();
        form.reset();
    })

    taskList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
            await indexedDB.remove(event.target.dataset.id);
            await renderTable();
        }
    })

    window.addEventListener('unhandledrejection', (event) => {
        throw new Error(event.reason.message);
    });
})()

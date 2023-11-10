export class Table {
    constructor(tasks, container) {
        this.tasks = tasks;
        this.container = container;
    }

    render() {
        let tableRow = '';
        this.tasks.forEach((task) => {
            tableRow += `<tr id="${task.key}">
                            <td>${task.key}</td>
                            <td>${task.value}</td>
                            <td><button class="button delete-button" data-id="${task.key}">Delete task</button></td>
                        </tr>`;
        });
        this.container.innerHTML = tableRow;
    }
}

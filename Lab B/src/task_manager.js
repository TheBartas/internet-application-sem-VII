class TaskManager {
    constructor() {
        if (!localStorage.getItem('taskList')) {
            localStorage.setItem('taskList', JSON.stringify([]));
        }

        const searchInput = document.querySelector('.todo-list-search-bar');
        searchInput.addEventListener('input', (e) => taskManager.filterTasks(e.target.value));
    }

    addTask(title, date) {
        const currentDate = new Date().toJSON().slice(0, 10);
        title = title.trim();
        const titleLen = title.length;

        if (titleLen < 3 || titleLen > 255) {
            alert("Error! The message length must be between 3 and 255 characters.");
            return;
        }

        if (date && date < currentDate) {
            alert("Error! Incorrect date!");
            return;
        }

        const data = {
            "title": title,
            "date": date
        }

        let taskList = JSON.parse(localStorage.getItem('taskList'));
        taskList.push(data);
        localStorage.setItem('taskList', JSON.stringify(taskList));
        this.render();
    }

    render(queryTasks=null, query='') {
        var taskListContainer = document.getElementById('task-list');
        taskListContainer.innerHTML = '';
        let taskList = queryTasks || JSON.parse(localStorage.getItem('taskList'));

        if (taskList.length == 0) {
            taskListContainer.insertAdjacentHTML('beforeend', '<p class="todo-list-row-empty">Brak zadań 😴</p>');
            return;
        }

        for (const [index, task] of taskList.entries()) {
            let titleToHTML = task.title;
            let dateToHTML = task.date;

            if (query) {
                const regex = new RegExp(`(${query})`, 'gi');
                titleToHTML = titleToHTML.replace(regex, `<mark>$1</mark>`);
                dateToHTML = dateToHTML.replace(regex, `<mark>$1</mark>`);
            }

            const taskHTML = `
                <div class="todo-list-row" data-index="${index}">
                    <p class="todo-list-text" id="text">${titleToHTML}</p>
                    ${dateToHTML ? `<p class="todo-list-row-p-date" id="date">${dateToHTML}</p>` : ``}
                    <button class="todo-list-row-delete">🗑️</button>
                </div>`;
            taskListContainer.insertAdjacentHTML('beforeend', taskHTML);
        }

        const deleteButtons = document.querySelectorAll('.todo-list-row-delete');
        for (const [index, btn] of deleteButtons.entries()) {
            btn.addEventListener('click', () => this.deleteTask(index));
        }

        let rows = document.querySelectorAll('.todo-list-row');
        for (let row of rows) {
            row.addEventListener('dblclick', (e) => this.editMode(e));
        }
    }

    deleteTask(index) {
        let taskList = JSON.parse(localStorage.getItem('taskList'));
        taskList.splice(index, 1);
        localStorage.setItem('taskList', JSON.stringify(taskList));
        this.render();
    }

    editMode(e) {
        const row = e.target.closest('.todo-list-row');

        if (!row || e.target.classList.contains('todo-list-row-delete')) return;

        const P = row.querySelector('.todo-list-text');
        const DATE = row.querySelector('.todo-list-row-p-date');
        const oldText = P.textContent;
        const oldDate = DATE ? DATE.textContent : '';

        const input_P = document.createElement('input');
        input_P.type = 'text';
        input_P.value = oldText;
        input_P.classList.add('todo-list-edit-input-text');

        const input_DATE = document.createElement('input');
        input_DATE.type = 'date';
        input_DATE.value = oldDate;
        input_DATE.classList.add('todo-list-edit-input-date');

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('todo-list-edit-save-btn');
    
        P.replaceWith(input_P);
        if (DATE) DATE.replaceWith(input_DATE);
        row.querySelector('.todo-list-row-delete').insertAdjacentElement('beforebegin', saveButton);

        input_P.focus();

        const save = () => {
            const newTitle = input_P.value.trim();
            const newDate = input_DATE.value;

            if (!this.validate(newTitle, newDate)) return;

            const index = row.dataset.index;

            console.log(index)

            const taskList = JSON.parse(localStorage.getItem('taskList'));
            taskList[index].title = newTitle;
            taskList[index].date = newDate;
            localStorage.setItem('taskList', JSON.stringify(taskList));

            this.render();
        }

        const saveChanges = (e) => {
            if (!row.contains(e.target)) {
                document.removeEventListener('click', saveChanges);
                save();
            }   
        };

        const btnSaveChanges = () => {
            save();
        };

        document.addEventListener('click', saveChanges);
        saveButton.addEventListener('click', btnSaveChanges);
    }

    validate(title, date) {
        const currentDate = new Date().toJSON().slice(0, 10);
        const titleLen = title.length;

        if (titleLen < 3 || titleLen > 255) {
            alert("Error! The message length must be between 3 and 255 characters.");
            return false;
        }

        if (date && date < currentDate) {
            alert("Error! Incorrect date!");
            return false;
        }

        return true;
    }

    filterTasks(query) {
        query = query.trim().toLowerCase();

        const taskList = JSON.parse(localStorage.getItem('taskList'));

        if (query.length < 2) {
            this.render();
            return;
        }

        const queryTasks = taskList.filter((task) => task.title.toLowerCase().includes(query));

        this.render(queryTasks, query);

    }
}

const taskManager = new TaskManager();

taskManager.render();

const inputTask = document.querySelector('.todo-list-input-todo');
const inputDate = document.querySelector('.todo-list-input-date');

document.querySelector('.todo-list-add-task').addEventListener('click', () => {
    console.log('[TEST] todo-list-add-task');
    taskManager.addTask(inputTask.value, inputDate.value);
    inputTask.value = '';
    inputDate.value = '';
    inputTask.focus();
})
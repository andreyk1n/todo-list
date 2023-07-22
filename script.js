const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach(function(task)  {
    const cssClass = task.done ? "task-title task-title--done" : "task-title"

    // розмітка для нової задачі
    const taskHtml = `
    <li id='${task.id}'' class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./images/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./images/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>
    `
    // додаэмо на сторінку задачу
    tasksList.insertAdjacentHTML('beforeend', taskHtml)
})

checkEmptyList()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)


// функції

function addTask(e) {
    e.preventDefault() // відміна відправки форми

    // дістаємо текст із інпута
    const taskText = taskInput.value

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    tasks.push(newTask)

    saveToLocalStorage()

    const cssClass = newTask.done ? "task-title task-title--done" : "task-title"

    // розмітка для нової задачі
    const taskHtml = `
    <li id='${newTask.id}'' class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${newTask.text}</span>
        <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./images/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./images/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>
    `
    // додаэмо на сторінку задачу
    tasksList.insertAdjacentHTML('beforeend', taskHtml)

    // очистка інпута після додавання
    taskInput.value = ''
    taskInput.focus()

    checkEmptyList()
}

function deleteTask(e) {
    if (e.target.dataset.action !== 'delete') return

    const parentNode = e.target.closest('.list-group-item')

    const id = Number(parentNode.id)

    // const index = tasks.findIndex((task) => task.id === id)

    // tasks.splice(index, 1)

    tasks = tasks.filter((task) => task.id !== id)

    saveToLocalStorage()

    parentNode.remove()

    checkEmptyList()
}

function doneTask(e) {
    if (e.target.dataset.action !== 'done') return

    const parentNode = e.target.closest('.list-group-item')

    const id = Number(parentNode.id)

    const task = tasks.find((task) => task.id === id)

    task.done = !task.done

    saveToLocalStorage()

    const taskTitle = parentNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done')


}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListElement = `
        <li id="emptyList" class="list-group-item empty-list">
			<img src="./images/leaf.svg" alt="Empty" width="48" class="mt-3">
			<div class="empty-list__title">Список задач пустий</div>
		</li>
        `
        tasksList.insertAdjacentHTML('afterbegin', emptyListElement)
    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList')
        emptyListEl ? emptyListEl.remove() : null
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}
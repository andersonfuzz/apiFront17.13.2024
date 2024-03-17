const tBody = document.querySelector("tbody");
const addForm = document.querySelector(".add-form");
const inputReminder = document.querySelector(".input-reminder");

const fetchReminder = async () => {
    const response = await fetch("http://localhost:3001/stickyNotes");
    const stickyNotes = await response.json();
    return stickyNotes;
};
const addReminder = async (event) => {
    event.preventDefault();
    const reminder = { title: inputReminder.value };
    await fetch("http://localhost:3001/stickyNotes", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminder),
    });
    loadStickyNotes();
    inputReminder.value = "";
};
const deleteReminder = async (id) => {
    await fetch(`http://localhost:3001/stickyNotes/${id}`, {
        method: "delete",
    });
    loadStickyNotes();
};
const updateReminder = async ({ id, title }) => {
    await fetch(`http://localhost:3001/stickyNotes/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
    });
    loadStickyNotes();
};

const formatDate = (dateUTC) => {
    const options = {
        dateStyle: "long",
        timeStyle: "short",
    };
    const date = new Date(dateUTC).toLocaleString("pt-br", options);
    return date;
};

const createElement = (tag, text = "", html = "") => {
    const element = document.createElement(tag);

    if (text) {
        element.innerText = text;
    }
    if (html) {
        element.innerHTML = html;
    }
    return element;
};
const createRom = (reminder) => {
    const { id, title, created_at } = reminder;

    const tr = createElement("tr");
    const tdTitle = createElement("td", title);
    const tdCreated_at = createElement("td", formatDate(created_at));
    const tdActions = createElement("td");
    const editButton = createElement(
        "button",
        "",
        '<span class="material-symbols-outlined">edit</span>'
    );
    const deleteButton = createElement(
        "button",
        "",
        '<span class="material-symbols-outlined">delete</span>'
    );
    const editForm = createElement("form");
    const editInput = createElement("input");

    editInput.value = title;
    editForm.appendChild(editInput);

    editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        updateReminder({ id, title: editInput.value });
    });
    editButton.addEventListener("click", () => {
        tdTitle.innerText = "";
        tdTitle.appendChild(editForm);
    });

    editButton.classList.add("btn-action");
    deleteButton.classList.add("btn-action");

    deleteButton.addEventListener("click", () => deleteReminder(id));

    tdActions.appendChild(editButton);
    tdActions.appendChild(deleteButton);

    tr.appendChild(tdTitle);
    tr.appendChild(tdCreated_at);
    tr.appendChild(tdActions);

    return tr;
};
const loadStickyNotes = async () => {
    const stickyNotes = await fetchReminder();
    tBody.innerHTML = "";
    stickyNotes.forEach((reminder) => {
        const tr = createRom(reminder);
        tBody.appendChild(tr);
    });
};

addForm.addEventListener("submit", addReminder);
loadStickyNotes();

"use strict";

const input = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const list = document.getElementById("todo-list");
const statistics = document.getElementById("todo-statistics");

let todos = [];
let nextId = 1;

function render() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = todo.completed ? "todo-item completed" : "todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `完成：${todo.text}`);
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      render();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "删除";
    deleteButton.setAttribute("aria-label", `删除：${todo.text}`);
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((entry) => entry.id !== todo.id);
      render();
    });

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  statistics.textContent = `共 ${todos.length} 项，已完成 ${completedCount} 项`;
}

addButton.addEventListener("click", () => {
  const text = input.value.trim();

  if (!text) {
    window.alert("没有具体任务，无法添加待办");
    return;
  }

  todos.push({ id: nextId++, text, completed: false });
  input.value = "";
  render();
});

render();

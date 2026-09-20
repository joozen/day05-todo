"use strict";

const input = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const list = document.getElementById("todo-list");
const statistics = document.getElementById("todo-statistics");
const STORAGE_KEY = "todo-list-data";

function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch (error) {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = loadTodos();
let nextId = todos.reduce((maxId, todo) => Math.max(maxId, Number(todo.id) || 0), 0) + 1;
let searchTerm = "";

function render() {
  list.replaceChildren();
  const visibleTodos = searchTerm
    ? todos.filter((todo) => todo.text.includes(searchTerm))
    : todos;

  visibleTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = todo.completed ? "todo-item completed" : "todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `完成：${todo.text}`);
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
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
      saveTodos();
      render();
    });

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  const completedCount = visibleTodos.filter((todo) => todo.completed).length;
  statistics.textContent = `共 ${visibleTodos.length} 项，已完成 ${completedCount} 项`;
}

addButton.addEventListener("click", () => {
  const text = input.value.trim();

  if (!text) {
    window.alert("没有具体任务，无法添加待办");
    return;
  }

  todos.push({ id: nextId++, text, completed: false });
  input.value = "";
  saveTodos();
  render();
});

searchButton.addEventListener("click", () => {
  const keyword = searchInput.value.trim();

  if (!keyword) {
    window.alert("请输入要搜索的词");
    return;
  }

  searchTerm = keyword;
  render();
});

render();

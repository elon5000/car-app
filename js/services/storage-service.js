'use strict'

function saveToLocalStorage(entity, key) {
    localStorage.setItem(key, JSON.stringify(entity))
}

function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}
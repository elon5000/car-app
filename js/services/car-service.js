'use strict'

const MAX_RATE = 5
const PAGE_SIZE = 4
const DB_KEY = 'car_db'
const VENDORS = ['Audi', 'Subaro', 'Fiat', 'Seat', 'Toyota']
const gFilterBy = { vendor: '', minSpeed: -Infinity, maxSpeed: Infinity }

let gCars = loadFromLocalStorage(DB_KEY) || _createCars()

let gSortBy = null
let gPageIdx = 0

function addCar(vendor, speed) {
    const car = _createCar(vendor, speed)
    gCars.unshift(car)
    saveToLocalStorage(gCars, DB_KEY)
    return car
}

function updateCar(carId, speed) {
    const car = getCarById(carId)
    car.speed = speed
    saveToLocalStorage(gCars, DB_KEY)
}

function removeCar(carId) {
    const carIdx = gCars.findIndex(car => car._id === carId)
    gCars.splice(carIdx, 1)
    saveToLocalStorage(gCars, DB_KEY)
}

function getCars() {
    const cars = gCars.filter(car => {
        return car.vendor.includes(gFilterBy.vendor) &&
            car.speed >= gFilterBy.minSpeed &&
            car.speed <= gFilterBy.maxSpeed
    })
    cars.sort(((car1, car2) => _sortCars(car1, car2)))
    return cars.slice((gPageIdx * PAGE_SIZE), (gPageIdx + 1) * PAGE_SIZE)
}

function getCarById(carId) {
    return gCars.find(car => car._id === carId)
}

function getVendors() {
    return VENDORS
}

function getMaxRate() {
    return MAX_RATE
}

function getMaxPageSize() {
    return Math.ceil(gCars.length / PAGE_SIZE)
}

function setCarRate(carId, value) {
    const car = getCarById(carId)
    car.rate = (car.rate + value > MAX_RATE || car.rate + value < 0) ? car.rate : car.rate + value
    saveToLocalStorage(gCars, DB_KEY)
    return car
}

function setFilterBy(key, value) {
    gFilterBy[key] = value
}

function setSortBy(value) {
    gSortBy = value
}

function setPageIdx(value) {
    gPageIdx = ((gPageIdx + value) < 0 || (gPageIdx + value) > getMaxPageSize()) ? gPageIdx : gPageIdx + value
    return gPageIdx
}

function _sortCars(car1, car2) {
    if (gSortBy === 'vendor') return car1.vendor.localeCompare(car2.vendor)
    else return car2[gSortBy] - car1[gSortBy]
}

function _createCars(amount = 6) {
    const cars = []
    for (let i = 0; i < amount; i++) {
        const car = _createCar()
        cars.unshift(car)
    }
    saveToLocalStorage(cars, DB_KEY)
    return cars
}

function _createCar(vendor = _getRandomVendor(), speed = getRandomInt(10, 101)) {
    return {
        _id: makeId(),
        vendor,
        speed,
        rate: 0
    }
}

function _getRandomVendor() {
    return VENDORS[getRandomInt(0, VENDORS.length)]
}
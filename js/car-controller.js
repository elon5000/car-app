'use strict'

const MAX_RATE = 5

function onInit() {
    renderCarList()
    renderVendors()
}

function onCarDetails(carId) {
    const car = getCarById(carId)
    renderCarDetails(car)
}

function onCloseCarDetails() {
    renderCarList()
    const elCarDetailWarpper = document.querySelector('.car-detail-warpper')
    elCarDetailWarpper.classList.add('hidden')
}

function onAddCar() {
    const vendor = prompt('Vendor ?')
    if (!vendor) return
    const speed = +prompt('speed ?')
    if (isNaN(speed) || !speed) return alert('Invalid speed, please use numbers only')
    const car = addCar(vendor, speed)
    renderCarList()
    flashMsg(`car ${car._id} has been added succsesfuly`)
}

function onUpdateCar(carId) {
    const speed = +prompt('speed ?')
    if (isNaN(speed)) return alert('Invalid speed, please use numbers only')
    updateCar(carId, speed)
    onCloseCarDetails()
    renderCarList()
    flashMsg(`car ${carId} has been updated succsesfuly`)
}

function onRemoveCar(carId) {
    removeCar(carId)
    renderCarList()
    flashMsg(`car ${carId} has been removed succsesfuly`)
}

function onSetFilterBy(key, elInput) {
    const value = elInput.value
    elInput.title = value
    setFilterBy(key, value)
    renderCarList()
}

function onSetSortBy(value) {
    setSortBy(value)
    renderCarList()
}

function onSetCarRate(carId, value) {
    const car = setCarRate(carId, value)
    renderCarDetails(car)
}

function renderCarList() {
    const elCarList = document.querySelector('.car-list')
    const cars = getCars()
    if (!cars.length) return elCarList.innerText = 'No cars to display'
    const strHTMLs = cars.map(car => {
        return `
        <div class="flex column car-details-container">
        <img src="imgs/${car.vendor}.jpg" />
        <div class="flex column car-info">
        <h4>Vendor: ${car.vendor}</h4>
        <h4>Speed: ${car.speed}</h4>
        <h4>Rate: ${getRateHTML(car.rate)}</h4>
        <div class="flex row car-btn-container">
        <button onclick="onCarDetails('${car._id}')">Details</button>
        <button onclick="onRemoveCar('${car._id}')">Remove</button>
        </div>
        </div>
        </div>
        `
    })
    elCarList.innerHTML = strHTMLs.join('')
}

function renderCarDetails(car) {
    const elCarDetailWarpper = document.querySelector('.car-detail-warpper')
    const strHtml = `<section class="main-layout flex column absolute car-details">
        <img src="imgs/${car.vendor}.jpg" alt="No vendor found"/>
        <div class="flex column car-info">
        <h4>Vendor: ${car.vendor}</h4>
        <h4>Speed: ${car.speed}</h4>
        <div class="flex row rate-container">
        <button class="rate-btn" onclick="onSetCarRate('${car._id}', -1)">-</button>
        <h4>Rate: ${getRateHTML(car.rate)}</h4>
        <button class="rate-btn" onclick="onSetCarRate('${car._id}', 1)">+</button>
        </div>
        <div class="flex row car-btn-container">
        <button onclick="onUpdateCar('${car._id}')">Update</button>
        <button onclick="onRemoveCar('${car._id}')">Remove</button>
        </div>
        <button onclick="onCloseCarDetails()">Close</button>
        </div>
    </section>`
    elCarDetailWarpper.innerHTML = strHtml
    elCarDetailWarpper.classList.remove('hidden')
}

function renderVendors() {
    const vendors = getVendors()
    const elVendorSelect = document.querySelector('.vendor-select')
    const strHTMLs = vendors.map(vendor => {
        return `<option value="${vendor}">${vendor}</option>`
    })
    elVendorSelect.innerHTML = '<option value="">All</option>' + strHTMLs.join('')
}

function getRateHTML(rate) {
    let rateHTML = '<span class="flex row rate-starts">'
    for (let i = 0; i < rate; i++) {
        rateHTML += '<span class="star">★</span>'
    }
    for (let i = 0; i < (MAX_RATE - rate); i++) {
        rateHTML += '<span class="star">☆</span>'
    }
    rateHTML += '</span>'
    return rateHTML
}

function flashMsg(txt) {
    const elUserMessageWarpper = document.querySelector('.user-message-warpper')
    const strHTML = `<h3 class="absolute user-message">${txt}</h3>`
    elUserMessageWarpper.innerHTML = strHTML
    elUserMessageWarpper.classList.remove('hidden')
    setTimeout(() => elUserMessageWarpper.classList.add('hidden'), 1500)
}
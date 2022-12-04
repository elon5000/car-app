'use strict'

function onInit() {
    renderCarList()
    renderVendors()
}

function onCarDetails(carId) {
    const car = getCarById(carId)
    renderCarDetails(car)
}

function onCloseCarDetails(ev) {
    ev.stopPropagation()
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

function onUpdateCar(ev, carId) {
    ev.stopPropagation()
    const speed = +prompt('speed ?')
    if (isNaN(speed)) return alert('Invalid speed, please use numbers only')
    updateCar(carId, speed)
    onCloseCarDetails(ev)
    renderCarList()
    flashMsg(`car ${carId} has been updated succsesfuly`)
}

function onRemoveCar(ev, carId) {
    ev.stopPropagation()
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

function onSetSortBy(elInput) {
    const value = elInput.value
    elInput.title = value
    setSortBy(value)
    renderCarList()
}

function onSetCarRate(ev, carId, value) {
    ev.stopPropagation()
    const car = setCarRate(carId, value)
    renderCarDetails(car)
}

function onSetPageIdx(value) {
    const pageIdx = setPageIdx(value)
    const elPrevBtn = document.querySelector('.prev-btn')
    const elNextBtn = document.querySelector('.next-btn')
    elPrevBtn.disabled = (pageIdx === 0) ? true : false
    elNextBtn.disabled = (pageIdx === getMaxPageSize()) ? true : false
    renderCarList()
}

function renderCarList() {
    const elCarList = document.querySelector('.car-list')
    const cars = getCars()
    if (!cars.length) return elCarList.innerText = 'No cars to display'
    const strHTMLs = cars.map(car => {
        return `
        <div class="flex column car-details-container">
        <img title="Car image" src="imgs/${car.vendor.toLowerCase()}.jpg" alt="Car image" />
        <div class="flex column car-info">
        <h4 title="Vendor">Vendor: ${car.vendor}</h4>
        <h4 title="Speed">Speed: ${car.speed}</h4>
        <h4 title="Rate">Rate: ${getRateHTML(car.rate)}</h4>
        <div class="flex row car-btn-container">
        <button title="Car details" onclick="onCarDetails('${car._id}')">Details</button>
        <button title="Remove car" onclick="onRemoveCar(event, '${car._id}')">Remove</button>
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
        <img src="imgs/${car.vendor.toLowerCase()}.jpg" alt="No vendor found"/>
        <div class="flex column details-info">
        <h4>Vendor: ${car.vendor}</h4>
        <h4>Speed: ${car.speed}</h4>
        <div class="flex row rate-container">
        <button class="rate-btn" onclick="onSetCarRate(event,'${car._id}', -1)">-</button>
        <h4>Rate: ${getRateHTML(car.rate)}</h4>
        <button class="rate-btn" onclick="onSetCarRate(event,'${car._id}', 1)">+</button>
        </div>
        <div class="flex row car-btn-container">
        <button onclick="onUpdateCar(event,'${car._id}')">Update</button>
        <button onclick="onRemoveCar(event,'${car._id}')">Remove</button>
        </div>
        <button onclick="onCloseCarDetails(event)">Close</button>
        </div>
    </section>`
    elCarDetailWarpper.innerHTML = strHtml
    elCarDetailWarpper.classList.remove('hidden')
}

function renderVendors() {
    const vendors = getVendors()
    const elVendorSelect = document.querySelector('.vendor-select')
    const strHTMLs = vendors.map(vendor => {
        return `<option title="${vendor}" value="${vendor}">${vendor}</option>`
    })
    elVendorSelect.innerHTML = '<option title="All" value="">All</option>' + strHTMLs.join('')
}

function getRateHTML(rate) {
    let rateHTML = '<span class="flex row rate-starts">'
    for (let i = 0; i < rate; i++) {
        rateHTML += '<span class="star">★</span>'
    }
    for (let i = 0; i < (getMaxRate() - rate); i++) {
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
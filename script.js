const dragContainer = document.querySelector('#drag-container')
const dropContainer = document.querySelector('#drop-container')
const element1 = document.querySelector('#element-1')
const element2 = document.querySelector('#element-2')

let sections = null

//Create fields of dropContainer
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    const field = document.createElement('div')
    field.classList.add('field')
    field.dataset.coords = `${i}${j}`
    dropContainer.appendChild(field)
  }
}

// Now we need some logic to avoid wrapping
// ships. And also avoid placing a ship
// directly next to another one.

// Make element1 draggable
element1.draggable = 'true'
element1.dataset.sections = 5
element1.ondragstart = (ev) => {
  ev.dataTransfer.setData('text', ev.target.id)
  sections = ev.target.dataset.sections
}

// Make element2 draggable
element2.draggable = 'true'
element2.dataset.sections = 4
element2.ondragstart = (ev) => {
  ev.dataTransfer.setData('text', ev.target.id)
  sections = ev.target.dataset.sections
}

// Remove color from previously highlighted
// fields when mouse goes somewhere else
dropContainer.ondragleave = (ev) => {
  ev.preventDefault()
  let currentElement = ev.target
  for (let i = sections; i > 0; i--) {
    currentElement.classList.remove('highlight')
    currentElement = currentElement.nextSibling
  }
}

// Add color to fields  to highlight them
// where mouse is and fields on right to mouse
dropContainer.ondragover = (ev) => {
  ev.preventDefault()
  let currentElement = ev.target
  for (let i = sections; i > 0; i--) {
    currentElement.classList.add('highlight')
    currentElement = currentElement.nextSibling
  }
}

// Drop element into field and color this field
// and fields on the right to it
dropContainer.ondrop = (ev) => {
  ev.preventDefault()
  const data = ev.dataTransfer.getData('text')
  ev.target.appendChild(document.getElementById(data))

  let currentElement = ev.target
  for (let i = sections; i > 0; i--) {
    currentElement.classList.add('placed')
    currentElement = currentElement.nextSibling
  }
}

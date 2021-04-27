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
    field.addEventListener('dragleave', whitenFields)
    field.addEventListener('dragover', highlightFields)
    field.addEventListener('drop', placeElement)
    dropContainer.appendChild(field)
  }
}

// Avoid placing a ship directly next to another one.

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

// Add color to fields  to highlight them
// where mouse is and fields on right to mouse
function highlightFields(ev) {
  ev.preventDefault()

  if (checkWrap(ev.target) || checkPlaced(ev.target)) {
    return
  }

  let targetEl = ev.target
  for (let i = sections; i > 0; i--) {
    targetEl.classList.add('highlight')
    targetEl = targetEl.nextSibling
  }
}

// Remove color from previously highlighted
// fields when mouse goes somewhere else
function whitenFields(ev) {
  ev.preventDefault()

  let targetEl = ev.target

  for (let i = sections; i > 0; i--) {
    targetEl.classList.remove('highlight')
    targetEl = targetEl.nextSibling
  }
}

// Drop element into field and color this field
// and fields on the right to it
function placeElement(ev) {
  ev.preventDefault()

  if (checkWrap(ev.target) || checkPlaced(ev.target)) {
    return
  }

  // Drop draggable Element into target Element (unseen)
  const data = ev.dataTransfer.getData('text')
  ev.target.appendChild(document.getElementById(data))

  // Color appropriate fields after dropping
  let targetEl = ev.target
  for (let i = sections; i > 0; i--) {
    targetEl.classList.add('placed')
    // Remove Listeners so that here no Element can be dropped anymore
    targetEl.removeEventListener('dragover', highlightFields)
    targetEl.removeEventListener('drop', placeElement)
    targetEl = targetEl.nextSibling
  }
}

// Check if element would wrap (what is unwanted)
function checkWrap(targetBox) {
  const coords = targetBox.dataset.coords
  const xCoord = parseInt(coords[1])
  if (parseInt(sections) + xCoord > 10) {
    return true
  } else {
    return false
  }
}

/* Check if element would be placed on other
already placed element. (what is unwanted) */
function checkPlaced(targetBox) {
  for (let i = sections; i > 0; i--) {
    if (targetBox.classList.contains('placed')) {
      return true
    }
    targetBox = targetBox.nextSibling
  }
  return false
}

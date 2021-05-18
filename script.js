const dragContainer = document.querySelector('#drag-container')
const dropContainer = document.querySelector('#drop-container')
const element1 = document.querySelector('#element-1')
const element2 = document.querySelector('#element-2')
const element3 = document.querySelector('#element-3')

element1.dataset.sections = '5'
element2.dataset.sections = '4'
element3.dataset.sections = '3'

let draggedElementSections = null
let draggedElementCopy = null
let elementVerticalPosition = false

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

makeElementDraggable(element1)
makeElementDraggable(element2)
makeElementDraggable(element3)

function makeElementDraggable(element) {
  element.draggable = 'true'
  element.ondragstart = (ev) => {
    var img = new Image()
    ev.dataTransfer.setDragImage(img, 0, 0)
    ev.dataTransfer.setData('text', ev.target.id)
    ev.dataTransfer.effectAllowed = 'all'
    draggedElementSections = parseInt(ev.target.dataset.sections)

    draggedElementCopy = element.cloneNode(true)
    draggedElementCopy.style.position = 'absolute'

    document.body.append(draggedElementCopy)

    document.addEventListener('drag', (ev) => {
      draggedElementCopy.style.top = ev.pageY + 10 + 'px'
      draggedElementCopy.style.left = ev.pageX + 'px'
    })

    document.addEventListener('dragend', () => {
      draggedElementCopy.remove()
    })
  }

  // If ctrl key is pressed and hold
  // then display draggedElementCopy elementVerticalPosition
  element.ondrag = (ev) => {
    if (ev.ctrlKey) {
      draggedElementCopy.style.transform = 'rotate(90deg)'
      if (elementVerticalPosition === false) {
        elementVerticalPosition = true
        // Without whitenAllFields for some time elementVerticalPosition
        // highlights are displayed and horizontal
        whitenAllFields()
      }
    } else {
      draggedElementCopy.style.transform = ''
      if (elementVerticalPosition === true) {
        elementVerticalPosition = false
        // Without whitenAllFields for some time elementVerticalPosition
        // highlights are displayed and horizontal
        whitenAllFields()
      }
    }
  }
}

// Returns all fields depending on number of global var sections
// and if global var elementVerticalPosition is true or false
function getFields(targetEl) {
  let fields = []
  let coords = parseInt(targetEl.dataset.coords)

  const iterator = elementVerticalPosition ? 10 : 1

  for (let i = draggedElementSections; i > 0; i--) {
    const field = document.querySelector(
      `[data-coords='${coords < 10 ? 0 : ''}${coords}']`
    )

    if (field === null) {
      break
    }

    fields.push(field)
    // Prepare selection of field under current field
    coords += iterator
  }
  return fields
}

// Add color to fields  to highlight them
// where mouse is and fields on right to mouse
function highlightFields(ev) {
  ev.preventDefault()

  if (checkWrap(ev.target) || checkBlocked(ev.target)) {
    return
  }

  const fields = getFields(ev.target)
  fields.forEach((field) => field.classList.add('highlight'))
}

// For change from elementVerticalPosition to horizontal or otherway
function whitenAllFields() {
  fields = document.querySelectorAll('.field')
  fields.forEach((field) => {
    field.classList.remove('highlight')
  })
}

// Remove color from previously highlighted
// fields when mouse goes somewhere else
function whitenFields(ev) {
  ev.preventDefault()

  const fields = getFields(ev.target)
  fields.forEach((field) => field.classList.remove('highlight'))
}

// Color all appropriate fields after placing on valid spot
function placeElement(ev) {
  ev.preventDefault()
  if (checkWrap(ev.target) || checkBlocked(ev.target)) {
    return
  }

  const fields = getFields(ev.target)
  fields.forEach((field) => {
    field.classList.add('placed')

    const coords = parseInt(field.dataset.coords)
    blockFieldsAround(coords)

    // Remove Listeners so that here no Element can be dropped anymore
    field.removeEventListener('dragover', highlightFields)
    field.removeEventListener('drop', placeElement)
  })

  // Remove original element and draggedElementCopy
  const data = ev.dataTransfer.getData('text')
  document.getElementById(data).remove()
  draggedElementCopy.remove()
}

// Check if element would wrap (what is unwanted)
function checkWrap(targetEl) {
  const coords = targetEl.dataset.coords
  const coord = elementVerticalPosition ? parseInt(coords[0]) : parseInt(coords[1])

  return parseInt(draggedElementSections) + coord > 10 ? true : false
}

/* Check if element would be placed on blocked
field. (what is unwanted) */
function checkBlocked(targetEl) {
  let blocked = false
  const fields = getFields(targetEl)

  fields.forEach((field) => {
    if (field.classList.contains('blocked')) {
      blocked = true
    }
  })
  return blocked
}

// Block all fields around one specified field
function blockFieldsAround(coordsEl) {
  let blockedCoords = []

  // Block fields on bottom side
  blockedCoords.push(`${coordsEl + 9}`)
  blockedCoords.push(`${coordsEl + 10}`)
  blockedCoords.push(`${coordsEl + 11}`)

  // Block fields on top side
  blockedCoords.push(`${coordsEl - 9}`)
  blockedCoords.push(`${coordsEl - 10}`)
  blockedCoords.push(`${coordsEl - 11}`)

  // Block fields on left and right side
  blockedCoords.push(`${coordsEl - 1}`)
  blockedCoords.push(`${coordsEl + 1}`)

  blockedCoords.forEach((coords) => {
    const el = document.querySelector(
      `[data-coords='${coords < 10 ? 0 : ''}${coords}']`
    )
    if (el !== null) {
      el.classList.add('blocked')
    }
  })
}

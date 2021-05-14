const dragContainer = document.querySelector('#drag-container')
const dropContainer = document.querySelector('#drop-container')
const element1 = document.querySelector('#element-1')
const element2 = document.querySelector('#element-2')
const element3 = document.querySelector('#element-3')

element1.dataset.sections = '5'
element2.dataset.sections = '4'
element3.dataset.sections = '3'

let sections = null
let copy = null
let vertical = false

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
    sections = parseInt(ev.target.dataset.sections)

    copy = element.cloneNode(true)
    copy.style.position = 'absolute'

    document.body.append(copy)

    document.addEventListener('drag', (ev) => {
      copy.style.top = ev.pageY + 10 + 'px'
      copy.style.left = ev.pageX + 'px'
    })

    document.addEventListener('dragend', () => {
      copy.remove()
    })
  }

  // If ctrl key is pressed and hold
  // then display copy vertical
  element.ondrag = (ev) => {
    if (ev.ctrlKey) {
      copy.style.transform = 'rotate(90deg)'
      if (vertical === false) {
        vertical = true
        // Without whitenAllFields for some time vertical
        // highlights are displayed and horizontal
        whitenAllFields()
      }
    } else {
      copy.style.transform = ''
      if (vertical === true) {
        vertical = false
        // Without whitenAllFields for some time vertical
        // highlights are displayed and horizontal
        whitenAllFields()
      }
    }
  }
}

function getFields(targetEl) {
  let fields = []
  const iterator = vertical ? 10 : 1

  // for vertical Elements
  let coords = parseInt(targetEl.dataset.coords)

  for (let i = sections; i > 0; i--) {
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

  let targetEl = ev.target

  if (checkWrap(ev.target) || checkBlocked(ev.target)) {
    return
  }

  // Check if horizontal or vertical highlighting
  if (vertical) {
    // For vertical highlighting
    const fields = getFields(targetEl)
    fields.forEach((field) => field.classList.add('highlight'))
  } else {
    // For horizontal highlighting
    const fields = getFields(targetEl)
    fields.forEach((field) => field.classList.add('highlight'))
  }
}

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

  // Whiten all fields vertically
  const fieldsVert = getFields(ev.target)
  fieldsVert.forEach((field) => field.classList.remove('highlight'))

  // Whiten all fields horizontally
  const fieldsHoriz = getFields(ev.target)
  fieldsHoriz.forEach((field) => field.classList.remove('highlight'))
}

// Drop element into field and color this field
// and fields on the right to it
function placeElement(ev) {
  ev.preventDefault()

  let currentSection = ev.target

  if (checkWrap(ev.target) || checkBlocked(ev.target)) {
    return
  }

  if (vertical) {
    // Color appropriate vertical fields after dropping
    const fields = getFields(currentSection)
    fields.forEach((field) => {
      field.classList.add('placed')

      const coords = parseInt(field.dataset.coords)
      blockFieldsAround(coords)

      // Remove Listeners so that here no Element can be dropped anymore
      field.removeEventListener('dragover', highlightFields)
      field.removeEventListener('drop', placeElement)
    })

    // blockFieldsVerticalElement(ev)
  } else {
    // Color appropriate horizontal fields after dropping
    const fields = getFields(currentSection)
    fields.forEach((field) => {
      field.classList.add('placed')

      const coords = parseInt(field.dataset.coords)
      blockFieldsAround(coords)

      // Remove Listeners so that here no Element can be dropped anymore
      currentSection.removeEventListener('dragover', highlightFields)
      currentSection.removeEventListener('drop', placeElement)
    })
  }

  // Remove original element and copy
  const data = ev.dataTransfer.getData('text')
  document.getElementById(data).remove()
  copy.remove()
}

// Check if element would wrap (what is unwanted)
function checkWrap(targetBox) {
  const coords = targetBox.dataset.coords
  const coord = vertical ? parseInt(coords[0]) : parseInt(coords[1])

  return parseInt(sections) + coord > 10 ? true : false
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

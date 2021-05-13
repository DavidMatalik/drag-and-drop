/* Todos: 
- A lot of repeating code in blockFieldsVerticalElement and blockFieldsHorizontalElement
  How to write better/cleaner code? You could in general block all fields around a placed 
  field. Like that you don't have to specific about vertical/horizontal blocking.

- Write checkPlacedHorizontally und checkBlocked at beginning of function

- You could also write methods for getting vertical or horizontal fields
  needed for highlighting/whitening/placing methods --> DRY, cleaner code
*/

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

// Add color to fields  to highlight them
// where mouse is and fields on right to mouse
function highlightFields(ev) {
  ev.preventDefault()

  let targetEl = ev.target

  // Check if horizontal or vertical highlighting
  if (vertical) {
    if (
      checkWrapVertically(ev.target) ||
      checkPlacedVertically(ev.target) ||
      checkBlockedVertically(ev.target)
    ) {
      return
    }

    // For vertical highlighting
    let coords = parseInt(targetEl.dataset.coords)
    for (let i = sections; i > 0; i--) {
      targetEl.classList.add('highlight')
      // Select the element which is directly under
      // targetEl.
      coords += 10
      targetEl = document.querySelector(`[data-coords='${coords}']`)
    }
  } else {
    if (
      checkWrapHorizontally(ev.target) ||
      checkPlacedHorizontally(ev.target) ||
      checkBlockedHorizontally(ev.target)
    ) {
      return
    }

    // For horizontal highlighting
    for (let i = sections; i > 0; i--) {
      targetEl.classList.add('highlight')
      targetEl = targetEl.nextSibling
    }
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

  let targetEl = ev.target

  // Whiten all fields vertically
  let coords = parseInt(targetEl.dataset.coords)
  for (let i = sections; i > 0; i--) {
    targetEl.classList.remove('highlight')
    // Select the element which is directly under
    // targetEl.
    coords += 10
    targetEl = document.querySelector(`[data-coords='${coords}']`)
    if (targetEl === null) {
      break
    }
  }

  targetEl = ev.target
  // Whiten all fields horizontally
  for (let i = sections; i > 0; i--) {
    targetEl.classList.remove('highlight')
    targetEl = targetEl.nextSibling
  }
}

// Drop element into field and color this field
// and fields on the right to it
function placeElement(ev) {
  ev.preventDefault()

  let currentSection = ev.target

  if (vertical) {
    if (
      checkWrapVertically(ev.target) ||
      checkPlacedVertically(ev.target) ||
      checkBlockedVertically(ev.target)
    ) {
      return
    }

    let coords = parseInt(currentSection.dataset.coords)
    for (let i = sections; i > 0; i--) {
      currentSection.classList.add('placed')

      // Remove Listeners so that here no Element can be dropped anymore
      currentSection.removeEventListener('dragover', highlightFields)
      currentSection.removeEventListener('drop', placeElement)
      coords += 10
      currentSection = document.querySelector(`[data-coords='${coords}']`)
    }

    blockFieldsVerticalElement(ev)
  } else {
    if (
      checkWrapHorizontally(ev.target) ||
      checkPlacedHorizontally(ev.target) ||
      checkBlockedHorizontally(ev.target)
    ) {
      return
    }

    // Color appropriate horizontal fields after dropping
    for (let i = sections; i > 0; i--) {
      currentSection.classList.add('placed')

      // Remove Listeners so that here no Element can be dropped anymore
      currentSection.removeEventListener('dragover', highlightFields)
      currentSection.removeEventListener('drop', placeElement)
      currentSection = currentSection.nextSibling
    }

    blockFieldsHorizontalElement(ev)
  }

  // Remove original element and copy
  const data = ev.dataTransfer.getData('text')
  document.getElementById(data).remove()
  copy.remove()
}

// Check if element would wrap (what is unwanted)
function checkWrapHorizontally(targetBox) {
  const coords = targetBox.dataset.coords
  const xCoord = parseInt(coords[1])
  if (parseInt(sections) + xCoord > 10) {
    return true
  } else {
    return false
  }
}

// Check if element would wrap (what is unwanted)
function checkWrapVertically(targetBox) {
  const coords = targetBox.dataset.coords
  const yCoord = parseInt(coords[0])
  if (parseInt(sections) + yCoord > 10) {
    return true
  } else {
    return false
  }
}

/* Check if element would be placed on other
already placed element. (what is unwanted) */
function checkPlacedHorizontally(targetBox) {
  for (let i = sections; i > 0; i--) {
    if (targetBox.classList.contains('placed')) {
      return true
    }
    targetBox = targetBox.nextSibling
  }
  return false
}

/* Check if element would be placed on other
already placed element. (what is unwanted) */
function checkPlacedVertically(targetBox) {
  let coords = parseInt(targetBox.dataset.coords)
  for (let i = sections; i > 0; i--) {
    if (targetBox.classList.contains('placed')) {
      return true
    }
    coords += 10
    targetBox = document.querySelector(`[data-coords='${coords}']`)
  }
  return false
}

/* Check if element would be placed on blocked
field. (what is unwanted) */
function checkBlockedHorizontally(targetBox) {
  for (let i = sections; i > 0; i--) {
    if (targetBox.classList.contains('blocked')) {
      return true
    }
    targetBox = targetBox.nextSibling
  }
  return false
}

/* Check if element would be placed on blocked
field. (what is unwanted) */
function checkBlockedVertically(targetBox) {
  let coords = parseInt(targetBox.dataset.coords)
  for (let i = sections; i > 0; i--) {
    if (targetBox.classList.contains('blocked')) {
      return true
    }
    coords += 10
    targetBox = document.querySelector(`[data-coords='${coords}']`)
  }
  return false
}

// Block all fields around placed element
function blockFieldsHorizontalElement(ev) {
  let blockedCoords = []
  let coordsLeftEl = ev.target.dataset.coords
  let coordsRightEl = `${coordsLeftEl[0]}${
    parseInt(coordsLeftEl[1]) + sections - 1
  }`

  // Block fields on left side
  blockLeftRight(coordsLeftEl, -1, 0)
  blockLeftRight(coordsLeftEl, -1, 1)
  blockLeftRight(coordsLeftEl, -1, -1)

  // Block fields on right side
  blockLeftRight(coordsRightEl, 1, 0)
  blockLeftRight(coordsRightEl, 1, 1)
  blockLeftRight(coordsRightEl, 1, -1)

  let currentSection = ev.target
  for (let i = sections; i > 0; i--) {
    coords = currentSection.dataset.coords

    // Block fields downside the element
    const coordsDown = parseInt(coords[0]) - 1 + coords[1]
    blockedCoords.push(coordsDown)

    // Block fields upside the element
    const coordsUp = parseInt(coords[0]) + 1 + coords[1]
    blockedCoords.push(coordsUp)
    currentSection = currentSection.nextSibling
  }

  blockedCoords.forEach((coords) => {
    const el = document.querySelector(`[data-coords='${coords}']`)
    if (el !== null) {
      el.classList.add('blocked')
    }
  })

  function blockLeftRight(coords, offsetX, offsetY) {
    coordsBlock = `${parseInt(coords[0]) + offsetY}${
      parseInt(coords[1]) + offsetX
    }`
    blockedCoords.push(coordsBlock)
  }
}

function blockFieldsVerticalElement(ev) {
  let blockedCoords = []
  let coordsTopEl = ev.target.dataset.coords
  let coordsBottomEl = `${parseInt(coordsTopEl[0]) + sections - 1}${
    coordsTopEl[1]
  }`

  // Block fields on top side
  blockTopBottom(coordsTopEl, -1, -1)
  blockTopBottom(coordsTopEl, 0, -1)
  blockTopBottom(coordsTopEl, 1, -1)

  // Block fields on bottom side
  blockTopBottom(coordsBottomEl, -1, 1)
  blockTopBottom(coordsBottomEl, 01, 1)
  blockTopBottom(coordsBottomEl, 1, 1)

  let currentSection = ev.target
  let coords = parseInt(currentSection.dataset.coords)
  for (let i = sections; i > 0; i--) {
    // Block fields on right of the element
    const coordsRight = `${coords + 1}`
    blockedCoords.push(coordsRight)

    // Block fields on left of the element
    const coordsLeft = `${coords - 1}`
    blockedCoords.push(coordsLeft)

    console.log(coordsLeft)

    coords += 10
    currentSection = document.querySelector(`[data-coords='${coords}']`)
  }

  blockedCoords.forEach((coords) => {
    const el = document.querySelector(`[data-coords='${coords}']`)
    if (el !== null) {
      el.classList.add('blocked')
    }
  })

  function blockTopBottom(coords, offsetX, offsetY) {
    coordsBlock = `${parseInt(coords[0]) + offsetY}${
      parseInt(coords[1]) + offsetX
    }`
    blockedCoords.push(coordsBlock)
  }
}

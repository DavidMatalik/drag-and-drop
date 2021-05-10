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
    } else {
      copy.style.transform = ''
    }
  }
}

// Add color to fields  to highlight them
// where mouse is and fields on right to mouse
function highlightFields(ev) {
  ev.preventDefault()

  if (
    checkWrap(ev.target) ||
    checkPlaced(ev.target) ||
    checkBlocked(ev.target)
  ) {
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

  if (
    checkWrap(ev.target) ||
    checkPlaced(ev.target) ||
    checkBlocked(ev.target)
  ) {
    return
  }

  // Remove original element and copy
  const data = ev.dataTransfer.getData('text')
  document.getElementById(data).remove()
  copy.remove()

  let currentSection = ev.target

  // Color appropriate fields after dropping
  for (let i = sections; i > 0; i--) {
    currentSection.classList.add('placed')

    // Remove Listeners so that here no Element can be dropped anymore
    currentSection.removeEventListener('dragover', highlightFields)
    currentSection.removeEventListener('drop', placeElement)
    currentSection = currentSection.nextSibling
  }

  blockFieldsAround(ev)
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

/* Check if element would be placed on blocked
field. (what is unwanted) */
function checkBlocked(targetBox) {
  for (let i = sections; i > 0; i--) {
    if (targetBox.classList.contains('blocked')) {
      return true
    }
    targetBox = targetBox.nextSibling
  }
  return false
}

// Block all fields around placed element
function blockFieldsAround(ev) {
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

  currentSection = ev.target
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

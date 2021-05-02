const dragContainer = document.querySelector('#drag-container')
const dropContainer = document.querySelector('#drop-container')
const element1 = document.querySelector('#element-1')
const element2 = document.querySelector('#element-2')

let vertical = false
let sections = null

element1.dataset.sections = 5
element2.dataset.sections = 4

//Create fields of dropContainer
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    const field = document.createElement('div')
    field.classList.add('field')
    field.dataset.coords = `${i}${j}`
    dropContainer.appendChild(field)
    field.addEventListener('mouseover', highlightFields)
    field.addEventListener('mouseleave', whitenFields)
  }
}

makeElementDraggable(element1)
makeElementDraggable(element2)

function makeElementDraggable(element) {
  // Regards to: https://javascript.info/mouse-drag-and-drop
  element.onmousedown = function (event) {
    element.style.position = 'absolute'
    element.style.zIndex = 1000

    sections = parseInt(element.dataset.sections)

    document.body.append(element)
    document.addEventListener('keyup', rotate)

    function moveAt(pageX, pageY) {
      element.style.left = pageX + 10 + 'px'
      element.style.top = pageY - element.offsetHeight / 2 + 'px'
    }

    moveAt(event.pageX, event.pageY)

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY)
    }

    function rotate(ev) {
      // 37 is left arrow key and 39 right arrow key
      if (ev.keyCode === 37 || ev.keyCode === 39) {
        if (vertical === false) {
          element.style.transform = 'rotate(90deg)'
          vertical = true
        } else if (vertical === true) {
          element.style.transform = ''
          vertical = false
        }
      }
    }

    document.addEventListener('mousemove', onMouseMove)

    element.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove)
      element.onmouseup = null
    }
  }
}

// Add color to fields  to highlight them
// where mouse is and fields on right to mouse
function highlightFields(ev) {
  let targetEl = ev.target

  for (let i = sections; i > 0; i--) {
    targetEl.classList.add('highlight')
    targetEl = targetEl.nextSibling
  }
}

// Remove color from previously highlighted
// fields when mouse goes somewhere else
function whitenFields(ev) {
  let targetEl = ev.target

  for (let i = sections; i > 0; i--) {
    targetEl.classList.remove('highlight')
    targetEl = targetEl.nextSibling
  }
}

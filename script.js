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

makeElementDraggable(element1)
makeElementDraggable(element2)

function makeElementDraggable(element) {
  // Regards to: https://javascript.info/mouse-drag-and-drop
  element.onmousedown = function (event) {
    element.style.position = 'absolute'
    element.style.zIndex = 1000

    document.body.append(element)

    function moveAt(pageX, pageY) {
      element.style.left = pageX - element.offsetWidth / 2 + 'px'
      element.style.top = pageY - element.offsetHeight / 2 + 'px'
    }

    moveAt(event.pageX, event.pageY)

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY)
    }

    document.addEventListener('mousemove', onMouseMove)

    element.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove)
      element.onmouseup = null
    }
  }
}

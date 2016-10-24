const Rx = window.Rx

// INITIAL_DATA is never changed directly, but used as a starting point for the stream
const INITIAL_DATA = [ 
  { id: 1, value: 'Good things' },
  { id: 2, value: 'Reactive things' }
]
let nextId = 3;

// Element references on the page
const addButton = document.getElementById('add')
const removeButton = document.getElementById('remove')
const textInput = document.getElementById('todo-text')

// A Very Simple render function :)
const render = (data) => {
  const content = document.getElementById('content')
  content.innerHTML = `<span>${data.map(item => item.value).join(', ')}</span>`
}

const add =
  // add gets new value (click event) every time the addButton is clicked
  Rx.Observable.fromEvent(addButton, 'click')
  // We don't actually care about the event, so we map it into our own
  .map(() => ({ action: 'add', value: textInput.value }))
  // We need to call .share() because we subscribe multiple times to this observable
  .share()

// We clear the textInput every time the 'add' has been clicked
add.subscribe(() => textInput.value = '')

// On clicking the 'remove' button, we send a 'remove' action on the handler below
// We could also send a specific ip as the payload if we wanted
const remove = Rx.Observable.fromEvent(removeButton, 'click')
  .map(() => ({ action: 'remove' }))

// This is our workhorse, that derives the actions into the data shown on the screen
// merge() function takes a list of observables and merges all the incoming values into
// a single stream of values
const finalData = Rx.Observable.merge(add, remove)
  // scan() works in a similar way than reduce, keeping the old accumulated value in store
  // and sending the new value as a second parameter for the callback function
  .scan((data, change) => {
    return (change.action === 'add')
      ? data.concat({ id: nextId++, value: change.value })
      : data.slice(0, data.length - 1);
  }, INITIAL_DATA)
  
// Finally, re-render every time the finalData changes
finalData.subscribe(render)

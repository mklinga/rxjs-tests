const Rx = window.Rx

const searchInput = document.getElementById('search')
const inputChange = Rx.Observable.fromEvent(searchInput, 'input')

const render = (data) => {
  const content = document.getElementById('content')

  const newContent = new DOMParser().parseFromString(`
    <div id="content">
      <h2>Showing ${data.length} results</h2>
      <ul>
        ${data.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </span>
  `, 'text/html').body.firstChild

  content.parentElement.replaceChild(newContent, content)
}

const wikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&origin=*&utf8=1&srsearch='

inputChange
  // Get the text value of the raw event
  .map(event => event.target.value)

  // Filter out empty queries
  .filter(value => value) 

  // Send query at maximum every 500ms
  .debounceTime(500) 

  // FlatMap is like a map that allows its result to send new events
  .flatMap(value => Rx.Observable.fromPromise(fetch(`${wikiUrl}${value}`)))

  // response.json() also returns a promise
  .flatMap(response => Rx.Observable.fromPromise(response.json()))

  // parse titles from the response object
  .map(responseObject => responseObject.query.search.map(result => result.title))

  // Finally render on all the changes
  .subscribe(render)

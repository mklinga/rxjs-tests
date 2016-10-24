const Rx = window.Rx;

const searchInput = document.getElementById('search');
const observable = Rx.Observable.fromEvent(searchInput, 'input');

// https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=Albert+Einstein

observable.subscribe({
  next: x => console.log('got value', x.target.value),
  error: err => console.error('something wrong occurred: ' + err),
  complete: () => console.log('done'),
});



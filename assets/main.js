let did = false;

var observeDOM = (function () {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function (obj, callback) {
    if (!obj || !obj.nodeType === 1) return; // validation

    if (MutationObserver) {
      // define a new observer
      var obs = new MutationObserver(function (mutations, observer) {
        callback(mutations);
      })
      // have the observer observe foo for changes in children
      obs.observe(obj, { childList: true, subtree: true });
    }

    else if (window.addEventListener) {
      obj.addEventListener('DOMNodeInserted', callback, false);
      obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  }
})();

let enablePicker = () => {
  if (!did) {
    var dt = new Date();
    dt.setMinutes(dt.getMinutes() + 30);
    flatpickr("#pickupTime", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true,
      minDate: dt,
      defaultDate: dt,
    });
    did = true;
  }
};

window.addEventListener('load', () => {
  let page = document.location.href.split('/').pop();

  if (page === 'checkout') {
    observeDOM(document, (m) => {
      if (!did) {
        let exists = document.querySelector('#pickupTime');
        if (exists) {
          enablePicker();
        }
      }
    })
  }
});

window.onhashchange = (event) => {
  let oldPage = event.oldURL.split('/').pop();
  let newPage = event.newURL.split('/').pop();

  if (oldPage !== newPage && newPage === 'checkout') {
    did = false;
    enablePicker();
  }
};

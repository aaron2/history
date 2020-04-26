document.addEventListener("DOMContentLoaded", function() {
  var buttons = document.getElementsByTagName('button');
  for (var i = 0; i < buttons.length; i++) {
    var type = buttons[i].addEventListener("click", function(d) {updateSignificance(this)});
  }
})

function updateSignificance(b) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    fetch("https://crack.lighter.net/history/significance", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: tabs[0].url,
        significance: b.id,
      }),
   }).catch(function(err) {
      alert(err);
    });
  });
}


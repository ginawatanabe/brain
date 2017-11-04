self.addEventListener('message', function(e) {
  // console.log("received a message!");
  self.postMessage(e.data);
});

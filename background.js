chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {state: 'fullscreen'});
  /*chrome.app.window.create('index.html', { 'outerBounds': {
                                                            'width': 1024,
                                                            'height': 768
                                                          }
      });*/
  /*chrome.app.window.create('index.html', { 'outerBounds': {
                                                            'width': 1024,
                                                            'height': 600
                                                          }
      });*/
});
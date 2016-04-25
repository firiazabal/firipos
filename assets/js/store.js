// Store.js
function fstorage() {
  this.storage = chrome.storage.local;
  this.disabled = false;
  this.enabled = true;
  this.set = function(key, val) {
                if (val === undefined) { return this.remove(key); }
                var obj = {};
                obj[key] = val;
                return this.storage.set(obj, function() {
                            if (chrome.runtime.error)
                              console.log("Runtime error.");
                });
              };
  this.get = function(key, callback) {
                var val;
                this.storage.get(key, function (resp) {
                  val = resp[key];
                  if (callback)
                    callback(resp[key]);
                });
              };
  this.remove = function(key) { this.storage.remove(key); };
  this.clear = function() { this.storage.clear(); };

  try {
    var testKey = '__storejs__';
    this.set(testKey, "1");
    this.get(testKey, function(val){if (val!=testKey){disabled = true;enabled = false;}});
    this.remove(testKey);
  } catch(e) {
    this.disabled = true;
  }
}
var store = new fstorage();

const sysPath = require('path');

FSWatcher.prototype._getWatchedDir = function(directory) {
  // absloute directory path
  var dir = sysPath.resolve(directory);
  var watcherRemove = this._remove.bind(this);

  if (!(dir in this._watched))
    this._watched[dir] =
    {
      _items: Object.create(null),
      add: function(item) {
        if (item !== '.' && item !== '..')
          this._items[item] = true;
      },
      remove: function(item) {
        delete this._items[item];
        if (!this.children().length) {
          fs.readdir(dir, function(err) {
            if (err)
              watcherRemove(sysPath.dirname(dir), sysPath.basename(dir));
          });
        }
      },
      children: function() {
        return Object.keys(this._items);
      },
      has: function() {
        return item in this._items;
      }
    };

    return this._watched[dir];
};
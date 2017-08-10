var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var sysPath = require('path');
var asyncEach = require('async-each');
var anymatch = require('anymatch');
var globParent = require('glob-parent');
var isGlob = require('is-glob');
var isAbsolute = require('path-is-absolute');
var inherits = require('inherits');

var FsEventsHandler = require('./lib/fsevents-handler');

var arrify = function(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
};

var flatten = function(list, result) {
  if (result == null) result = [];
  list.forEach(function(item) {
    if (Array.isArray(item)) {
      flatten(item, result);
    } else {
      result.push(item);
    }
  });
  return result;
};

// Little isString util for use in Array#every.
var isString = function(thing) {
  return typeof thing === 'string';
};

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
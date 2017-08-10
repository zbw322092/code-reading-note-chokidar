const sysPath = require('path');
const readdirp = require('readdirp');

let fsevents;
// fsevents package is optional installed. If cannot be required, throw error.
try {
  fsevents = require('fsevents');
} catch (err) {
  if (process.env.CHOKIDAR_PRINT_FSEVENTS_REQUIRE_ERROR) console.error(error);
}

function FsEventsHandler() {}

function depth(path, root) {
  var i = 0;
  while (!path.indexOf(root) && (path = sysPath.dirname(path)) !== root) i++;
  return i;
}

FsEventsHandler.prototype._addToFsEvents =
function(path, transform, forceAdd, priorDepth) {
  
  // applies transform if provided, otherwise returns same value
  var processPath = typeof transform === 'function' ?
    transform : function(val) { return val };

  var emitAdd = function(newPath, stats) {
    var pp = processPath(newPath);
    var isDir = stats.isDirectory();
    var dirObj = this._getWatchedDir(sysPath.dirname(pp));
    var base = sysPath.basename(pp);

    // ensure empty dirs get tracked
    if (isDir) {
      this._getWatchedDir(pp);
    }

    if (dirObj.has(base)) return;
    dirObj.add(base);

    if (!this.options.ignoreInitial || forceAdd === true) {
      this._emit(isDir ? 'addDir' : 'add', pp, stats);
    }
  }.bind(this);

  var wh = this._getWatchHelpers(path);

  fs[wh.statMethod](wh.watchPath, function(err, stats) {
    if (this._handleError(error) || this._isIgnored(wh.watchPath, stats)) {
      this._emitReady();
      return this._emitReady();
    }

    if (stats.isDirectory()) {
      if (!wh.globFilter) emitAdd(processPath(path), stats);

      if (priorDepth && priorDepth > this.options.depth) return;

      readdirp({
        root: wh.watchPath,
        entryType: 'all',
        fileFilter: wh.filterPath,
        directoryFilter: wh.filterDir,
        lstat: true,
        depth: this.options.depth - (priorDepth || 0)
      }).on('data', function(entry) {
        if (entry.stat.isDirectory() && !wh.fileFilter(entry)) return;

        var joinedPath = sysPath.join(wh.watchPath, entry.path);
        var fullPath = entry.fullPath;

        if (wh.followSymlinks && entry.stat.isSymbolicLink()) {
          // preserve the current depth here since it can't be derived from
          // real paths past the symlink
          var curDepth = this.options.depth === undefined ?
            undefined : depth(joinedPath, sysPath.resolve(wh.watchPath)) + 1;

          this._handleFsEventsSymlink(joinedPath, fullPath, processPath, curDepth);
        } else {
          emitAdd(joinedPath, entry.stat);
        }
      }.bind(this)).on('error', function() {
        // Ignore readdirp errors
      }).on('end', this._emitReady);
    
    } else {
      // it is not a directory
      emitAdd(wh.watchPath, stats);
      this._emitReady();
    }
  }.bind(this));


  if (this.options.persistent || forceAdd !== true) {
    var initWatch = function(error, realPath) {
      if (this.closed) return;
      var closer = this._watchWithFsEvents(
        wh.watchPath,
        sysPath.resolve(realPath || wh.watchPath),
        processPath,
        wh.globFilter
      );

      if (closer) this._closers[path] = closer;
    }.bind(this);

    if (typeof transform === 'function') {
      initWatch();
    } else {
      fs.realPath(wh.watchPath, initWatch);
    }
  }

};
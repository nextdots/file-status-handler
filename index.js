const
  fs = require('fs'),
  moment = require('moment');

/*
*  Move a file to track its status
*/
function FileStatusHandler(file, fileOptions) {
  this.getFilename = getFilename;
  this.setInProgress = setInProgress;
  this.setProcessed = setProcessed;
  this.setWithError = setWithError;

  var current = fileOptions.incoming + file;
  var inProgressFilename;
  var processedFilename;
  var withErrorFilename;

  function rename(oldName, newName) {
    try {
      fs.renameSync(oldName, newName);
      current = newName;
    } catch (error) {
      console.error("Fatal error:", error);
      process.exit(1);
    }
  }

  function setInProgress() {
    if (current === inProgressFilename) return;
    inProgressFilename = getInProgressFilename();
    rename(current, inProgressFilename);
  }

  function setProcessed() {
    if (current === processedFilename) return;
    processedFilename = getProcessedFilename();
    rename(current, processedFilename);
  }

  function setWithError() {
    if (current === withErrorFilename) return;
    withErrorFilename = getWithErrorFilename();
    rename(current, withErrorFilename);
  }

  function getFilename() {
    return current;
  }

  function getInProgressFilename() {
    return inProgressFilename || fileOptions.inprogress + file + "." + moment().format("x");
  }

  function getProcessedFilename() {
    return processedFilename || fileOptions.processedOk + file + "." + moment().format("x");
  }

  function getWithErrorFilename() {
    return withErrorFilename || fileOptions.processedError + file + "." + moment().format("x");
  }
}

module.exports = FileStatusHandler;

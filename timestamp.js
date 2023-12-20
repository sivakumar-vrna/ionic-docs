var replace = require('replace-in-file');
const moment = require('moment-timezone');
var timeStamp = moment(new Date()).tz('Asia/Kolkata').format("DD/MMM/YYYY hh:mm:ss A z");
const options = {
files: [
'src/environments/environment.ts',
'src/environments/environment.staging.ts',
'src/environments/environment.prod.ts',
],
from: /timeStamp: '(.*)'/g,
to: "timeStamp: '" + timeStamp + "'",
allowEmptyPaths: false,
};
try {
let changedFiles = replace.sync(options);
if (changedFiles == 0) {
throw "Please make sure that the file '" + options.files + "' has \"timeStamp: ''\"";
}
console.log('Build timestamp is set to: ' + timeStamp);
} catch (error) {
console.error('Error occurred:', error);
throw error
}
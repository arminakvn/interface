var app, cluster, cpuCount, i;

// cluster = require('cluster');

// if (cluster.isMaster) {
//     cpuCount = require('os').cpus().length;
//     i = 0;
//     while (i < cpuCount) {
//         cluster.fork();
//         i += 1;
//     }
//     cluster.on('exit', function(worker) {
//         console.log('Worker %d died, replacing', worker.id);
//         cluster.fork();
//     });
// } else {
//     app = require('./app.js');
//     app.app.listen(app.port);
// }
app = require('./app.js');
// app.app.listen(app.port);
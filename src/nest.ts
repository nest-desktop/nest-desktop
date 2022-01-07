const exec = require('child_process').exec;

function execute(command: string, callback = null) {
  try {
    exec(command, (error: any, stdout: any, stderr: any) => {
      if (callback) {
        callback(stdout);
      } else {
        console.log(stdout);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function start() {
  execute('nest-server start -h 0.0.0.0 -d"');
  // execute(
  //   'uwsgi --module nest.server:app --http-socket 0.0.0.0:5000 --uid $USER --daemonize "/tmp/nest-server.log"'
  // );
}

async function stop() {
  execute('nest-server stop -h 0.0.0.0');
}

export const nest = {
  start,
  stop,
};

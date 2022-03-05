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

function start(): void {
  execute('nest-server start -d -h 0.0.0.0"');
}

async function stop(): Promise<any> {
  execute('nest-server stop -h 0.0.0.0');
}

export const nest = {
  start,
  stop,
};

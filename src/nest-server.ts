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

async function start(): Promise<any> {
  execute('nest-server start -d');
}

async function stop(): Promise<any> {
  execute('nest-server stop');
}

export const nestServer = {
  start,
  stop,
};

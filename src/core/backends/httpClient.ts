export class HttpClient {
  constructor() {}

  ping(url: string, callback: any): void {
    const started: number = new Date().getTime();
    const req: XMLHttpRequest = new XMLHttpRequest();
    req.open('GET', url, /*async*/ true);
    req.setRequestHeader('Access-Control-Allow-Headers', 'Origin');
    req.setRequestHeader('Access-Control-Allow-Methods', 'GET');
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.timeout = 1000;
    req.onreadystatechange = () => {
      let ended: number;
      let milliseconds: number;
      switch (req.readyState) {
        case 4:
          ended = new Date().getTime();
          milliseconds = ended - started;
          if (callback !== null) {
            callback(req, milliseconds);
          }
          break;
      }
    };
    try {
      req.send(null);
    } catch (exception) {
      // this is expected
      console.log(exception);
    }
  }

  get(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const req: XMLHttpRequest = new XMLHttpRequest();
      req.open('GET', url, /*async*/ true);
      req.setRequestHeader('Access-Control-Allow-Headers', 'Origin');
      req.setRequestHeader('Access-Control-Allow-Methods', 'GET');
      req.setRequestHeader('Access-Control-Allow-Origin', '*');
      req.onreadystatechange = () => {
        switch (req.readyState) {
          // TODO: Verify need for switch
          // case 1:
          //   console.log('Request started.');
          //   break;
          // case 2:
          //   console.log('Headers received.');
          //   break;
          // case 3:
          //   console.log('Headers received.');
          //   break;
          case 4:
            resolve(req);
            break;
        }
      };

      // req.addEventListener('progress', event => console.log('progress', event));
      // req.addEventListener('load', event => console.log('lead', event));
      // req.addEventListener('error', event => console.log('error', event));
      // req.addEventListener('abort', event => console.log('abort', event));

      try {
        req.send(null);
      } catch (exception) {
        console.log(exception);
        // this is expected
        reject(req);
      }
    });
  }

  post(url: string, data: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const req: XMLHttpRequest = new XMLHttpRequest();
      req.open('POST', url, /*async*/ true);
      req.setRequestHeader(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type'
      );
      req.setRequestHeader('Access-Control-Allow-Methods', 'POST');
      req.setRequestHeader('Access-Control-Allow-Origin', '*');
      req.setRequestHeader('Content-Type', 'application/json');
      req.onreadystatechange = () => {
        switch (req.readyState) {
          // TODO: Verify need for switch
          // case 1:
          //   console.log('Request started.');
          //   break;
          // case 2:
          //   console.log('Headers received.');
          //   break;
          // case 3:
          //   console.log('Headers received.');
          //   break;
          case 4:
            resolve(req);
            break;
        }
      };

      // req.addEventListener('progress', event => console.log('progress', event));
      // req.addEventListener('load', event => console.log('lead', event));
      // req.addEventListener('error', event => console.log('error', event));
      // req.addEventListener('abort', event => console.log('abort', event));

      try {
        req.send(JSON.stringify(data));
      } catch (exception) {
        console.log(exception);
        // this is expected
        reject(req);
      }
    });
  }
}

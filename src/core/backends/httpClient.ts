export class HttpClient {
  constructor() {}

  /**
   * Ping the server.
   */
  ping(url: string, callback: any = undefined): void {
    // console.log('ping');
    const started: number = new Date().getTime();
    const req: XMLHttpRequest = new XMLHttpRequest();
    req.open('GET', url, /*async*/ true);
    req.setRequestHeader('Access-Control-Allow-Headers', 'Origin');
    req.setRequestHeader('Access-Control-Allow-Methods', 'GET');
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    // req.timeout = 1000;
    req.onreadystatechange = () => {
      let ended: number;
      let milliseconds: number;
      switch (req.readyState) {
        // case 1:
        //   console.log('Request started.');
        //   ended = new Date().getTime();
        //   milliseconds = ended - started;
        //   console.log(url, req.readyState, req.status, milliseconds);
        //   break;
        // case 2:
        //   console.log('Headers received.');
        //   ended = new Date().getTime();
        //   milliseconds = ended - started;
        //   console.log(url, req.readyState, req.status, milliseconds);
        //   break;
        // case 3:
        //   console.log('Loading.');
        //   ended = new Date().getTime();
        //   milliseconds = ended - started;
        //   console.log(url, req.readyState, req.status, milliseconds);
        //   break;
        case 4:
          // console.log('Done.');
          ended = new Date().getTime();
          milliseconds = ended - started;
          // console.log(url, req.status, milliseconds + 'ms');
          if (callback !== undefined) {
            callback(req);
          }
          break;
      }
    };

    // req.onload = function() {
    //   console.log('on load');
    // };
    //
    // req.ontimeout = function(e) {
    //   console.log('on timeout', e);
    // };

    try {
      req.send(null);
    } catch (exception) {
      console.log(exception);
    }
  }

  /**
   * Send GET requests to the server.
   */
  get(url: string): Promise<any> {
    // console.log('get request');
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
          //   resolve(req);
          //   break;
          // case 2:
          //   console.log('Headers received.');
          //   resolve(req);
          //   break;
          // case 3:
          //   console.log('Loading.');
          //   resolve(req);
          //   break;
          case 4:
            console.log('Done.');
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
        // console.log(exception);
        reject(req);
      }
    });
  }

  /**
   * Send POST requests to the server.
   */
  post(url: string, data: any): Promise<any> {
    // console.log('post request');
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
        // console.log(exception);
        reject(req);
      }
    });
  }
}

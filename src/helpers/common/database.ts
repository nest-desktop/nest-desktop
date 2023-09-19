// database.ts

import PouchDB from "pouchdb";
import { ILogObj, Logger } from "tslog";
import { major, minor } from "semver";
import { v4 as uuidv4 } from "uuid";

import { truncate } from "@/utils/truncate";
import { logger as mainLogger } from "./logger";

export class DatabaseService {
  // @ts-ignore
  private _db: PouchDB;
  private _options: any;
  private _state: any = {
    ready: false,
    valid: false,
    version: "",
  };
  private _url: string;
  private _logger: Logger<ILogObj>;

  constructor(url: string, options: any = {}) {
    this._url = url;
    this._logger = mainLogger.getSubLogger({
      name: `[${this._url}] database`,
    });

    this._options = options;
    this._db = new PouchDB(url, options);

    // this.getVersion().then((version: string) => {
    //   this._state.version = version;
    // });
    // this.checkVersion();
    this._state.ready = true;
  }

  // @ts-ignore
  get db(): PouchDB {
    return this._db;
  }

  get logger(): Logger<ILogObj> {
    return this._logger;
  }

  get state(): any {
    return this._state;
  }

  get isReady(): boolean {
    return this._state.ready;
  }

  get isValid(): boolean {
    return this._state.valid;
  }

  count(): any {
    this._logger.silly("count");
    return this._db
      .allDocs()
      .then((result: any) => result.total_rows)
      .catch((err: any) => this._logger.error("Get all docs:", err.stack));
  }

  async destroy(): Promise<any> {
    return this._db
      .destroy()
      .catch((err: any) => this._logger.error("Destroy db:", err.stack));
  }

  list(sortedBy: string = "", reverse: boolean = false): any {
    this._logger.trace("list");
    return this._db
      .allDocs({ include_docs: true })
      .then((res: any) => {
        const docs: any[] = res.rows.map((row: any) => row.doc);
        if (sortedBy) {
          docs.sort((a: any, b: any) => a[sortedBy].localeCompare(b[sortedBy]));
        }
        if (reverse) {
          docs.reverse();
        }
        return docs;
      })
      .catch((err: any) => this._logger.error("Get all docs:", err.stack));
  }

  async reset(): Promise<any> {
    this._logger.trace("reset");
    return this.destroy().then(() => {
      this._db = new PouchDB(this._url, this._options);
    });
  }

  clean(data: any): void {
    data.version = process.env.APP_VERSION;
    if (!data.id) {
      data.id = uuidv4();
    }
  }

  // CRUD - Create, Read, Update, Delete

  create(data: any): any {
    this._logger.trace("create");
    this.clean(data);
    data.createdAt = new Date();
    return this._db
      .post(data)
      .catch((err: any) => this._logger.error("Post doc:", err.stack));
  }

  read(id: string, rev: string = ""): any {
    this._logger.trace("read:", truncate(id));
    return this._db
      .get(id, { rev })
      .then((doc: any) => doc)
      .catch((err: any) => this._logger.error("Get doc:", err.stack));
  }

  update(id: string, data: any): any {
    this._logger.trace("update:", truncate(id));
    this.clean(data);
    return this._db
      .get(id)
      .then((doc: any) => {
        data.updatedAt = new Date();
        const keys: string[] = Object.keys(data);
        keys
          .filter((key: string) => !key.startsWith("_"))
          .forEach((key: string) => (doc[key] = data[key]));
        return this._db
          .put(doc)
          .catch((err: any) => this._logger.error("Put doc:", err.stack));
      })
      .catch((err: any) => {
        this._logger.error("Get doc:", err.stack);
        // return this.create(data);
      });
  }

  delete(id: string): any {
    this._logger.trace("delete:", truncate(id));
    return this._db
      .get(id)
      .then((doc: any) =>
        this._db
          .remove(doc)
          .catch((err: any) => this._logger.error("Remove doc:", err.stack))
      )
      .catch((err: any) => this._logger.error("Get doc:", err.stack));
  }

  deleteBulk(ids: string[]): any {
    return this.list().then((docs: any[]) => {
      docs
        .filter((doc: any) => ids.includes(doc._id))
        .forEach((doc: any) => (doc._deleted = true));
      return this._db
        .bulkDocs(docs)
        .catch((err: any) => this._logger.error("Bulk docs:", err.stack));
    });
  }

  revisions(id: string): any {
    return this._db
      .get(id, { revs: true })
      .then((doc: any) =>
        doc._revisions.ids.map(
          (revId: string, idx: number) =>
            doc._revisions.start - idx + "-" + revId
        )
      )
      .catch((err: any) => this._logger.error("Get doc:", err.stack));
  }

  // Version

  getVersion(): any {
    return this._db
      .get("_local/version")
      .then((doc: any) => doc.version)
      .catch((err: any) => {
        console.log(err);
        this._logger.error("Get version:", err.stack);
      });
  }

  setVersion(): any {
    return this._db
      .put({
        _id: "_local/version",
        version: process.env.APP_VERSION,
      })
      .catch((err: any) => this._logger.error("Set version:", err.stack));
  }

  checkVersion(): void {
    this.getVersion()
      .then((dbVersion: string) => {
        const appVersion: string = process.env.APP_VERSION || "";
        this._state.valid =
          major(dbVersion) === major(appVersion) &&
          minor(dbVersion) === minor(appVersion);
      })
      .catch((err: any) => {
        this._logger.error("Get version:", err.stack);
        this.setVersion().then(() => this.checkVersion());
      });
  }
}

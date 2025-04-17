// database.ts

import PouchDB from "pouchdb";
import { major, minor } from "semver";
import { v4 as uuidv4 } from "uuid";

import { sortString } from "@/utils/array";
import { truncate } from "@/utils/truncate";

import { BaseObj } from "./base";

export interface IDoc {
  _deleted?: boolean;
  _id?: string;
  _rev?: string;
  _revisions?: {
    ids: string[];
    start: number;
  };
  createdAt?: string;
  id?: string;
  updatedAt?: string;
  version?: string;
  [key: string]: any;
}

export interface IRes {
  id: string;
  ok: boolean;
  rev: string;
  rows: { doc: IDoc }[];
  total_rows: number;
}

interface IErr {
  stack: string;
}

export class DatabaseService extends BaseObj {
  private _db: PouchDB;
  private _options: PouchDB.Configuration.DatabaseConfiguration;
  private _state: { ready: boolean; valid: boolean; version: string } = {
    ready: false,
    valid: false,
    version: "",
  };
  private _url: string;

  constructor(url: string, options?: PouchDB.Configuration.DatabaseConfiguration) {
    super();

    this._url = url;
    this._options = options || {};
    this._db = new PouchDB(url, options);

    // this.getVersion().then((version: string) => {
    //   this._state.version = version;
    // });
    // this.checkVersion();
    this._state.ready = true;
  }

  get db(): PouchDB {
    return this._db;
  }

  get state(): { ready: boolean; valid: boolean; version: string } {
    return this._state;
  }

  get isReady(): boolean {
    return this._state.ready;
  }

  get isValid(): boolean {
    return this._state.valid;
  }

  async count(): Promise<number> {
    this.logger.silly("count");

    return this._db
      .allDocs()
      .then((res: IRes) => res.total_rows)
      .catch((err: IErr) => this.logger.error("Get all docs:", err.stack));
  }

  async destroy(): Promise<IDoc> {
    return this._db.destroy().catch((err: IErr) => this.logger.error("Destroy db:", err.stack));
  }

  async list(sortedBy: string = "", reverse: boolean = false): Promise<IDoc[]> {
    this.logger.trace("list");

    return this._db
      .allDocs({ include_docs: true })
      .then((res: IRes) => {
        const docs: IDoc[] = res.rows.map((row: { doc: IDoc }) => row.doc);
        if (sortedBy) docs.sort((a: IDoc, b: IDoc) => sortString(a[sortedBy], b[sortedBy]));
        if (reverse) docs.reverse();
        return docs;
      })
      .catch((err: IErr) => this.logger.error("Get all docs:", err.stack));
  }

  async reset(): Promise<IDoc | void> {
    this.logger.trace("reset");

    return this.destroy().then(() => (this._db = new PouchDB(this._url, this._options)));
  }

  clean(data: IDoc): void {
    data.version = process.env.APP_VERSION as string;
    if (!data.id) {
      data.id = uuidv4();
    }
  }

  // CRUD - Create, Read, Update, Delete

  async create(data: IDoc): Promise<IRes> {
    this.logger.trace("create");

    this.clean(data);
    data.createdAt = new Date().toISOString();
    return this._db.post(data).catch((err: IErr) => this.logger.error("Post doc:", err.stack));
  }

  async read(id: string, rev: string = ""): Promise<IRes> {
    this.logger.trace("read:", truncate(id));

    return this._db.get(id, { rev }).catch((err: IErr) => this.logger.error("Get doc:", err.stack));
  }

  async update(id: string, data: IDoc): Promise<IRes> {
    this.logger.trace("update:", truncate(id));

    this.clean(data);
    return this._db
      .get(id)
      .then((doc: IDoc) => {
        data.updatedAt = new Date().toISOString();

        Object.keys(data)
          .filter((key: string) => !key.startsWith("_"))
          .forEach((key: string) => (doc[key] = data[key]));

        return this._db.put(doc).catch((err: IErr) => this.logger.error("Put doc:", err.stack));
      })
      .catch((err: IErr) => {
        this.logger.error("Get doc:", err.stack);
        // return this.create(data);
      });
  }

  async delete(id: string): Promise<IRes> {
    this.logger.trace("delete:", truncate(id));

    return this._db
      .get(id)
      .then((doc: IDoc) => this._db.remove(doc).catch((err: IErr) => this.logger.error("Remove doc:", err.stack)))
      .catch((err: IErr) => this.logger.error("Get doc:", err.stack));
  }

  async deleteBulk(ids: string[]): Promise<IDoc[]> {
    return this.list().then((docs: IDoc[]) => {
      docs.filter((doc: IDoc) => ids.includes(doc._id as string)).forEach((doc: IDoc) => (doc._deleted = true));
      return this._db.bulkDocs(docs).catch((err: IErr) => this.logger.error("Bulk docs:", err.stack));
    });
  }

  async revisions(id: string): Promise<IDoc | void> {
    return this._db
      .get(id, { revs: true })
      .then((doc: IDoc) =>
        doc._revisions
          ? doc._revisions.ids.map((revId: string, idx: number) =>
              doc._revisions ? doc._revisions.start - idx + "-" + revId : "",
            )
          : [],
      )
      .catch((err: IErr) => this.logger.error("Get doc:", err.stack));
  }

  // Version

  async getVersion(): Promise<string> {
    return this._db
      .get("_local/version")
      .then((doc: IDoc) => doc.version)
      .catch((err: IErr) => {
        this.logger.error("Get version:", err.stack);
      });
  }

  async setVersion(): Promise<string> {
    return this._db
      .put({
        _id: "_local/version",
        version: process.env.APP_VERSION,
      })
      .catch((err: IErr) => this.logger.error("Set version:", err.stack));
  }

  checkVersion(): void {
    this.getVersion()
      .then((dbVersion: string) => {
        const appVersion: string = process.env.APP_VERSION || "";
        this._state.valid = major(dbVersion) === major(appVersion) && minor(dbVersion) === minor(appVersion);
      })
      .catch((err: IErr) => {
        this.logger.error("Get version:", err.stack);
        this.setVersion().then(() => this.checkVersion());
      });
  }
}

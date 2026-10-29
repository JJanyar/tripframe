// Walks a folder (File System Access handle, dropped entry, or <input webkitdirectory>)
// and returns the media files with their path relative to the opened folder.

import { VIDEO_EXT, IMAGE_EXT } from './parse.js';

const SKIP_DIR = /^(\.|System Volume Information$|\$RECYCLE\.BIN$|LOST\.DIR$)/i;
const isMedia = (name) => !name.startsWith('.') && (VIDEO_EXT.test(name) || IMAGE_EXT.test(name));

export const supportsPicker = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

export async function scanHandle(dir, onProgress) {
  const out = [];
  async function walk(handle, prefix) {
    for await (const entry of handle.values()) {
      if (entry.kind === 'directory') {
        if (!SKIP_DIR.test(entry.name)) await walk(entry, `${prefix}${entry.name}/`);
      } else if (isMedia(entry.name)) {
        // Not awaited one by one: the browser answers all of them at once, much sooner.
        const path = prefix + entry.name;
        out.push(entry.getFile().then((file) => ({ path, file })));
        if (out.length % 25 === 0) onProgress?.(out.length);
      }
    }
  }
  await walk(dir, '');
  return Promise.all(out);
}

export function scanFileList(list) {
  return [...list]
    .filter((f) => isMedia(f.name))
    .map((f) => {
      const parts = (f.webkitRelativePath || f.name).split('/');
      return { path: parts.length > 1 ? parts.slice(1).join('/') : parts[0], file: f };
    })
    .filter((x) => !x.path.split('/').slice(0, -1).some((d) => SKIP_DIR.test(d)));
}

export async function scanEntry(root, onProgress) {
  const out = [];
  const readAll = (reader) =>
    new Promise((resolve, reject) => {
      const all = [];
      const next = () =>
        reader.readEntries((batch) => {
          if (!batch.length) resolve(all);
          else {
            all.push(...batch);
            next();
          }
        }, reject);
      next();
    });
  async function walk(entry, prefix) {
    if (entry.isDirectory) {
      if (SKIP_DIR.test(entry.name)) return;
      for (const child of await readAll(entry.createReader())) await walk(child, `${prefix}${entry.name}/`);
    } else if (isMedia(entry.name)) {
      const file = await new Promise((res, rej) => entry.file(res, rej));
      out.push({ path: prefix + entry.name, file });
      if (out.length % 25 === 0) onProgress?.(out.length);
    }
  }
  if (root.isDirectory) {
    for (const child of await readAll(root.createReader())) await walk(child, '');
  } else await walk(root, '');
  return out;
}

// Small IndexedDB key/value store: remembers the last folder handle and caches thumbnails.
const DB = 'dashcam-dashboard';
let dbp;
function db() {
  dbp ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('kv');
      req.result.createObjectStore('thumbs');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp;
}

export async function idbGet(store, key) {
  try {
    const d = await db();
    return await new Promise((res, rej) => {
      const r = d.transaction(store).objectStore(store).get(key);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  } catch {
    return undefined;
  }
}

export async function idbSet(store, key, value) {
  try {
    const d = await db();
    await new Promise((res, rej) => {
      const tx = d.transaction(store, 'readwrite');
      tx.objectStore(store).put(value, key);
      tx.oncomplete = res;
      tx.onerror = () => rej(tx.error);
    });
  } catch {
    /* storage unavailable: cache is optional */
  }
}

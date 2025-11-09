// src/duck.ts
import * as duckdb from '@duckdb/duckdb-wasm';
import wasmUrl from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import workerUrl from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

export async function initDuck() {
  // Build a minimal bundle for Vite
  const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    eh: { mainModule: wasmUrl, mainWorker: workerUrl },
  };

  // Pick the right bundle for this browser
  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

  // Spin up the worker and DB
  const worker = new Worker(bundle.mainWorker!);
  const logger = new duckdb.ConsoleLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);

  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  return db;
}

// src/duck.ts
// src/duck.ts
import duckdb, { AsyncDuckDB, ConsoleLogger } from "@duckdb/duckdb-wasm";

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

// Pruebas automáticas que corre el pipeline (CI) en cada push y pull request.
// Si alguna falla, GitHub Actions NO publica la app.
const { test, describe } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const { BLOQUES, MATERIAS, LABS, estado, mins } = require("../public/datos.js");
const PUBLIC = path.join(__dirname, "..", "public");

describe("Datos de horarios", () => {
  test("hay 14 bloques y cada uno termina después de empezar", () => {
    assert.strictEqual(BLOQUES.length, 14);
    BLOQUES.forEach(([ini, fin]) => assert.ok(mins(fin) > mins(ini), `${ini}-${fin}`));
  });

  test("no hay ids de laboratorio repetidos", () => {
    const ids = LABS.map(l => l.id);
    assert.strictEqual(new Set(ids).size, ids.length);
  });

  test("cada laboratorio tiene exactamente 5 días (lunes a viernes)", () => {
    LABS.forEach(l => assert.strictEqual(l.d.length, 5, `Lab ${l.id}`));
  });

  test("cada clase tiene formato bloque|materia|grupo|profe", () => {
    LABS.forEach(l => l.d.flat().forEach(s =>
      assert.strictEqual(s.split("|").length, 4, `Lab ${l.id}: "${s}"`)));
  });

  test("todos los bloques están entre 1 y 14", () => {
    LABS.forEach(l => l.d.flat().forEach(s => {
      const b = Number(s.split("|")[0]);
      assert.ok(Number.isInteger(b) && b >= 1 && b <= 14, `Lab ${l.id}: "${s}"`);
    }));
  });

  test("no hay dos clases en el mismo bloque del mismo día", () => {
    LABS.forEach(l => l.d.forEach((dia, i) => {
      const bloques = dia.map(s => s.split("|")[0]);
      assert.strictEqual(new Set(bloques).size, bloques.length, `Lab ${l.id}, día ${i}`);
    }));
  });

  test("todas las materias existen en MATERIAS", () => {
    LABS.forEach(l => l.d.flat().forEach(s => {
      const mat = s.split("|")[1];
      assert.ok(MATERIAS[mat], `Lab ${l.id}: materia desconocida "${mat}"`);
    }));
  });
});

describe("Lógica de disponibilidad: estado()", () => {
  test("Lab 1103, lunes bloque 1: libre hasta las 8:20", () => {
    const r = estado("1103", 0, 1);
    assert.strictEqual(r.libre, true);
    assert.strictEqual(r.hasta, "8:20");
  });

  test("Lab 1103, lunes bloque 2: ocupado y se libera a las 11:40", () => {
    const r = estado("1103", 0, 2);
    assert.strictEqual(r.libre, false);
    assert.strictEqual(r.c.g, "DSM4B");
    assert.strictEqual(r.seLibera, "11:40");
  });

  test("Lab 1103, jueves bloque 9: libre el resto del día", () => {
    const r = estado("1103", 3, 9);
    assert.strictEqual(r.libre, true);
    assert.strictEqual(r.todoDia, true);
    assert.strictEqual(r.hasta, "19:10");
  });
});

describe("Archivos de la PWA", () => {
  test("manifest.json es JSON válido y tiene nombre e iconos", () => {
    const m = JSON.parse(fs.readFileSync(path.join(PUBLIC, "manifest.json"), "utf8"));
    assert.ok(m.name);
    assert.ok(m.icons.length > 0);
  });

  test("todos los archivos que guarda el service worker existen", () => {
    const sw = fs.readFileSync(path.join(PUBLIC, "sw.js"), "utf8");
    const lista = JSON.parse(sw.match(/const ARCHIVOS = (\[.*?\]);/)[1]);
    lista.filter(f => f !== "./").forEach(f =>
      assert.ok(fs.existsSync(path.join(PUBLIC, f)), `Falta ${f}`));
  });

  test("index.html carga datos.js", () => {
    const html = fs.readFileSync(path.join(PUBLIC, "index.html"), "utf8");
    assert.ok(html.includes('<script src="datos.js"></script>'));
  });
});

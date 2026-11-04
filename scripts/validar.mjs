#!/usr/bin/env node
// Valida data/latest.json antes de publicar. Uso: node scripts/validar.mjs [archivo]
import fs from "node:fs";

const file = process.argv[2] || new URL("../data/latest.json", import.meta.url);
const errores = [];
const err = (m) => errores.push(m);
let d;
try {
  d = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (e) {
  console.error("JSON inválido:", e.message);
  process.exit(1);
}

const str = (v, ruta) => (typeof v === "string" && v.trim() ? true : (err(`${ruta}: texto requerido`), false));
const arr = (v, ruta, min = 0) => (Array.isArray(v) && v.length >= min ? true : (err(`${ruta}: lista con al menos ${min} elementos`), false));
const url = (v, ruta) => (typeof v === "string" && /^https?:\/\/\S+$/.test(v) ? true : (err(`${ruta}: URL inválida`), false));

if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha ?? "")) err("fecha: formato AAAA-MM-DD");
const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
if (d.fecha !== hoy) console.warn(`Aviso: fecha ${d.fecha} distinta de hoy en Bogotá (${hoy}).`);
if (d.demo !== false) err("demo: debe ser false");
str(d.titular_del_dia, "titular_del_dia");
if (arr(d.lo_esencial, "lo_esencial", 3)) d.lo_esencial.forEach((x, i) => str(x, `lo_esencial[${i}]`));

for (const sec of ["colombia", "mundo"]) {
  if (!arr(d[sec], sec, 3)) continue;
  d[sec].forEach((t, i) => {
    const r = `${sec}[${i}]`;
    for (const k of ["titulo", "categoria", "resumen", "por_que_importa", "coincidencias", "diferencias", "analisis", "implicaciones", "que_vigilar"]) str(t[k], `${r}.${k}`);
    if (!Number.isInteger(t.importancia) || t.importancia < 1 || t.importancia > 5) err(`${r}.importancia: entero 1–5`);
    if (arr(t.perspectivas, `${r}.perspectivas`, 2)) t.perspectivas.forEach((p, j) => { str(p.medio, `${r}.perspectivas[${j}].medio`); str(p.enfoque, `${r}.perspectivas[${j}].enfoque`); });
    if (arr(t.fuentes, `${r}.fuentes`, 1)) t.fuentes.forEach((f, j) => { str(f.medio, `${r}.fuentes[${j}].medio`); str(f.titulo, `${r}.fuentes[${j}].titulo`); url(f.url, `${r}.fuentes[${j}].url`); });
  });
}

str(d.lectura_mercados, "lectura_mercados");
arr(d.agenda, "agenda");
if (arr(d.mercados, "mercados", 1)) d.mercados.forEach((m, i) => {
  str(m.nombre, `mercados[${i}].nombre`);
  str(m.grupo, `mercados[${i}].grupo`);
  if (typeof m.valor !== "number") err(`mercados[${i}].valor: número`);
  for (const k of ["variacion_pct", "variacion_mes_pct"]) if (m[k] != null && typeof m[k] !== "number") err(`mercados[${i}].${k}: número o null`);
});
if (arr(d.macro, "macro")) d.macro.forEach((m, i) => { str(m.nombre, `macro[${i}].nombre`); str(m.valor, `macro[${i}].valor`); if (m.url) url(m.url, `macro[${i}].url`); });

if (errores.length) {
  console.error(`✗ ${errores.length} error(es):\n- ` + errores.join("\n- "));
  process.exit(1);
}
console.log(`✓ ${d.fecha}: ${d.colombia.length} temas Colombia, ${d.mundo.length} temas mundo, ${d.mercados.length} indicadores.`);

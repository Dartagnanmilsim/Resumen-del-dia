# Resumen del Día — instrucciones para la edición diaria

Este repositorio publica en GitHub Pages (https://dartagnanmilsim.github.io/Resumen-del-dia/) un informe diario para un directivo colombiano sin tiempo: los temas más relevantes de Colombia y el mundo, indicadores económicos y una comparación de cómo los cubren distintos medios, sin sesgo político.

La página (`index.html`, `app.js`, `styles.css`) lee `data/latest.json`. **La edición diaria consiste solo en producir ese JSON**; no modifique la página salvo que se pida.

## Procedimiento diario

1. Fecha: use la fecha de hoy en hora de Bogotá (`TZ=America/Bogota date +%F`).
2. Investigue con búsqueda web (modo `extended` para noticias del día; varias búsquedas en paralelo):
   - **Colombia**: economía y política fiscal, Congreso, Gobierno, Banco de la República, orden público, energía, regulación, empresas. Diarios: El Tiempo, El Espectador, Semana, El Colombiano, La República, Portafolio, Valora Analitik, La Silla Vacía, Cambio, Infobae Colombia, Blu Radio, Caracol.
   - **Mundo**: geopolítica, EE. UU., Europa, China, América Latina, energía, mercados. Medios de distintos países y líneas editoriales: Reuters, AP, BBC, NYT, WSJ, Fox News, CNN, Guardian, FT, The Economist, El País, Le Monde, DW, France 24, Al Jazeera, SCMP, Clarín, CNBC, Bloomberg.
   - **Indicadores**: TRM vigente, dólar en el mercado colombiano, Brent, WTI, café, oro, COLCAP, S&P 500, Nasdaq, Dow, bono EE. UU. 10 años, y los macro oficiales vigentes (tasa BanRep, inflación DANE, desempleo DANE, tasa Fed, etc.).
3. Escriba `data/latest.json` y una copia idéntica en `data/archivo/AAAA-MM-DD.json`. Agregue la fecha al inicio de `data/indice.json` (lista de fechas, la más reciente primero, sin duplicados).
4. Valide con `node scripts/validar.mjs` y corrija hasta que pase.
5. `git add data && git commit -m "Informe diario AAAA-MM-DD" && git push origin main`.

## Reglas editoriales (obligatorias)

- **Solo hechos verificados en las fuentes encontradas.** Nunca invente cifras, citas, hechos ni enlaces. Si un dato no se confirma con una fuente fechada de los últimos días, déjelo fuera y menciónelo en `balance_cobertura`.
- Cuidado con resultados viejos: muchas búsquedas devuelven notas de años anteriores. Verifique la fecha de cada nota.
- **Neutralidad política estricta**: atribuya cada valoración ("según X", "sus críticos sostienen"), presente el mejor argumento de cada lado sin falsos equilibrios, separe hechos de interpretaciones.
- Las "opiniones" son análisis de impacto para decisiones empresariales, no posturas políticas.
- Las perspectivas comparan **cómo encuadra cada medio** el tema (qué enfatiza, qué omite); son descriptivas, no juicios sobre los medios.
- Español claro y directo, frases cortas. Prioridad por relevancia real, no farándula.
- Las URLs de `fuentes` deben ser las URLs reales devueltas por la búsqueda.

## Formato de `data/latest.json`

Tome como modelo exacto el `data/latest.json` existente. Campos:

- `fecha` (AAAA-MM-DD), `generado` (ISO), `modelo` (null), `demo` (false)
- `titular_del_dia`: la idea más importante del día en una frase.
- `lo_esencial`: 4–6 viñetas.
- `colombia` y `mundo`: 4–6 temas cada uno. Cada tema: `titulo`, `categoria`, `importancia` (1–5), `resumen`, `por_que_importa`, `perspectivas` [{`medio`, `enfoque`}], `coincidencias`, `diferencias`, `analisis`, `implicaciones`, `que_vigilar`, `fuentes` [{`medio`, `titulo`, `url`}].
- `lectura_mercados`: 3–5 frases.
- `agenda`: próximos eventos con fecha.
- `balance_cobertura`: sesgos o vacíos de la cobertura y datos que no se pudieron verificar.
- `mercados`: [{`id`, `nombre`, `grupo` (Divisas | Materias primas | Bolsas | Tasas | Riesgo), `unidad`, `decimales`, `valor` (número), `variacion_pct` (número o null), `variacion_mes_pct` (número o null), `vigencia` (p. ej. "Cierre 3 nov"), `fuente`}]. Opcional `serie` (lista de números) para la minigráfica.
- `macro`: [{`nombre`, `valor` (texto), `fecha_dato`, `fuente`, `url`, `comentario`}].
- `cobertura`: {`total_articulos`, `medios`: [{`medio`, `articulos`, `ok`: true}]} — cuente las notas citadas por medio.
- `uso`: null.

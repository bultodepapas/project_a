Actúa como extractor y normalizador de contenido. Voy a proporcionarte un PDF (puede tener hipervínculos embebidos en texto, botones, referencias, DOIs y URLs acortadas).

Objetivo

Extraer TODO el contenido textual del PDF (todo el documento, completo).

Convertir cada hipervínculo a texto plano, dejando la URL completa visible.

Reglas obligatorias (sin excepciones)

No omitas nada: incluye título, subtítulos, cuerpo, notas al pie, referencias, anexos, captions de figuras/tablas y cualquier texto marginal que esté en el PDF.

Conserva el orden y la estructura del documento lo mejor posible (encabezados, párrafos, listas, numeraciones, tablas en formato legible).

No uses hipervínculos clicables en la salida final: todo debe ser texto plano.

Cada vez que detectes un hipervínculo (texto ancla con URL embebida, botón, DOI, email, URL visible o acortada), debes:

Mantener el texto tal como aparece en el PDF, y

Poner inmediatamente al lado la URL completa en corchetes así: Texto del enlace [https://ejemplo.com/ruta]

No recortes URLs: deben ir completas (incluyendo https://, parámetros ?, &, #, etc.).

Si el PDF tiene un texto enlazado pero la URL no es visible (solo está embebida), extrae igualmente la URL real y colócala entre corchetes.

Si hay URLs acortadas (bit.ly, t.co, etc.), no inventes la URL final. Déjalas tal cual estén (a menos que el PDF ya muestre la URL expandida).

Si el enlace es un correo, formL / Teams / Zoom / Drive / etc., mantenlo igual con su esquema:

Contacto [mailto:correo@dominio.com]

Reunión [https://...]

Si aparece el mismo enlace varias veces, repítelo cada vez donde aparezca (no consolides).

No agregues análisis, comentarios, ni resumen. Solo el texto del documento transformado.

Formato de salida

Entrega el contenido en texto plano, respetando saltos de línea.

Para tablas: reprodúcelas en formato texto (por ejemplo, con filas y separadores) sin perder celdas si es posible.

Para imágenes o figuras con texto relevante (títulos/captions): incluye al menos el caption y cualquier texto que esté escrito como parte del documento.

Control de calidad antes de entregar

Verifica que no quede ningún enlace oculto sin su URL en [ ].

Verifica que no haya hipervínculos clicables (solo texto).

Verifica que el documento esté completo (de la primera a la última sección).

Ahora, cuando te entregue el PDF, realiza el proceso y devuelve el documento completo con los enlaces convertidos a texto plano.

Mini-ejemplo de cómo debe quedar

Original: “Lee el informe completo aquí.” (con link embebido)

Salida: “Lee el informe completo aquí [https://sitio.com/informe.pdf].”

Si
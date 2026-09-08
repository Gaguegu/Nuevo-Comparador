const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function createManualPDF() {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 45, left: 45, right: 45 },
    bufferPages: true,
    info: {
      Title: 'Manual de Usuario - ANSAMA Comparador Eléctrico',
      Author: 'ANSAMA',
      Subject: 'Guía de uso y funcionamiento del Comparador de Tarifas Eléctricas',
      Keywords: 'ANSAMA, Comparador, Tarifas Eléctricas, Manual, Factura de Luz',
    }
  });

  const outputPath = path.join(__dirname, '../public/manual-usuario-ansama.pdf');
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const primaryColor = '#0f172a'; // Slate oscuro
  const accentRed = '#dc2626';    // Rojo ANSAMA
  const secondaryColor = '#334155'; // Gris texto
  const lightBg = '#f8fafc';       // Fondo claro cajas
  const borderGrey = '#e2e8f0';    // Borde sutil

  // Helper para dibujar encabezado de página
  function drawHeader(pageNum) {
    if (pageNum === 1) return; // Portada no lleva encabezado
    doc.save();
    doc.fontSize(8).fillColor('#64748b').text('ANSAMA • Manual de Usuario | Comparador de Tarifas Eléctricas', 45, 20);
    doc.moveTo(45, 32).lineTo(550, 32).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
    doc.restore();
  }

  // Helper para dibujar pie de página
  function drawFooter(pageNum, totalPages) {
    doc.save();
    doc.moveTo(45, 795).lineTo(550, 795).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
    doc.fontSize(8).fillColor('#64748b').text('ANSAMA Energía — Documentación confidencial y comercial', 45, 802);
    doc.fontSize(8).fillColor('#64748b').text(`Página ${pageNum} de ${totalPages}`, 450, 802, { align: 'right', width: 100 });
    doc.restore();
  }

  // ==========================================
  // PÁGINA 1: PORTADA & RESUMEN EJECUTIVO
  // ==========================================

  // Barra lateral decorativa roja
  doc.rect(0, 0, 14, 842).fill(accentRed);

  // Logo ANSAMA
  const logoPath = path.join(__dirname, '../public/ansama_logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 160 });
  }

  doc.moveDown(3.5);

  // Etiqueta superior
  doc.fontSize(10).fillColor(accentRed).font('Helvetica-Bold').text('DOCUMENTO TÉCNICO Y COMERCIAL', 50, 115);

  // Título Principal
  doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
     .text('Manual de Usuario y Guía Operativa', 50, 135);
  doc.fontSize(15).fillColor('#dc2626').font('Helvetica-Bold')
     .text('Comparador Inteligente de Tarifas Eléctricas ANSAMA', 50, 168);

  doc.fontSize(10).fillColor('#64748b').font('Helvetica')
     .text('Versión 2.0 • Compatible con Web, Tablet, Móvil y PWA Instalable', 50, 192);

  doc.moveTo(50, 212).lineTo(550, 212).lineWidth(1.5).strokeColor(accentRed).stroke();

  // Caja de Resumen Ejecutivo
  doc.rect(50, 230, 500, 120).fillAndStroke(lightBg, borderGrey);
  doc.fontSize(11).fillColor(primaryColor).font('Helvetica-Bold').text('¿Qué es el Comparador de Tarifas ANSAMA?', 65, 245);
  doc.fontSize(9.5).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    'El Comparador de Tarifas ANSAMA es una herramienta profesional diseñada para asesores energéticos y clientes comerciales y residenciales. Su objetivo es calcular con precisión matemática el coste exacto de una factura eléctrica real (término de potencia, energía, alquiler de contador, impuesto eléctrico e IVA) y contrastarla de manera instantánea frente a las mejores tarifas de ANSAMA, calculando el ahorro exacto en euros y en porcentaje anual.',
    65, 265, { width: 470, align: 'justify' }
  );

  // Cuadrícula de capacidades clave
  const cards = [
    { title: 'Cálculo 100% Exacto', desc: 'Fórmulas oficiales con días de facturación, potencias P1-P2 y consumos P1-P2-P3 con hasta 6 decimales.' },
    { title: 'Ahorro Automático', desc: 'Detecta de forma instantánea la tarifa más ventajosa y calcula el ahorro en la factura y el acumulado anual.' },
    { title: 'Historial Local Seguro', desc: 'Guarda múltiples comparativas por cliente para retomarlas o consultarlas en cualquier momento.' },
    { title: 'App PWA & Móvil', desc: 'Instalable como app nativa en Android e iOS, con funcionamiento offline y vista móvil adaptada.' }
  ];

  let cardY = 370;
  cards.forEach((card, idx) => {
    const x = idx % 2 === 0 ? 50 : 310;
    const y = cardY + Math.floor(idx / 2) * 95;

    doc.rect(x, y, 240, 80).fillAndStroke('#ffffff', '#cbd5e1');
    doc.rect(x, y, 4, 80).fill(accentRed);

    doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text(card.title, x + 15, y + 12);
    doc.fontSize(8.5).fillColor(secondaryColor).font('Helvetica').lineGap(2).text(card.desc, x + 15, y + 30, { width: 215 });
  });

  // Caja de metadatos inferior
  doc.rect(50, 590, 500, 160).fillAndStroke('#0f172a', '#0f172a');
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold').text('Estructura de este Manual:', 70, 610);

  const sections = [
    '1. Introducción de Datos de Factura (Días, Potencias P1/P2 y Consumos P1/P2/P3)',
    '2. Configuración de Precios de la Factura Actual del Cliente',
    '3. Comparativa Inteligente frente a Tarifas ANSAMA',
    '4. Interpretación de la Mejor Opción, Desgloses e Impuestos Oficiales',
    '5. Gestión del Historial, Guardado y Botón "Poner a Cero"',
    '6. Modo Móvil, Instalación PWA y Descargas'
  ];

  let secY = 635;
  sections.forEach((sec) => {
    doc.fontSize(9).fillColor('#f87171').font('Helvetica-Bold').text('▶ ', 70, secY);
    doc.fontSize(9).fillColor('#e2e8f0').font('Helvetica').text(sec, 85, secY);
    secY += 18;
  });

  // ==========================================
  // PÁGINA 2: PASO A PASO DETALLADO (1 y 2)
  // ==========================================
  doc.addPage();

  doc.fontSize(16).fillColor(primaryColor).font('Helvetica-Bold').text('1. Introducción de los Datos de la Factura', 45, 50);
  doc.fontSize(9.5).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    'Para iniciar una auditoría energética, el asesor o usuario únicamente necesita tener delante la última factura de luz del cliente. Los campos están organizados en bloques ergonómicos:',
    45, 75, { width: 505 }
  );

  // Bloque A
  doc.rect(45, 110, 505, 115).fillAndStroke(lightBg, borderGrey);
  doc.fontSize(11).fillColor(accentRed).font('Helvetica-Bold').text('A. Fechas y Días de Facturación', 60, 122);
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    '• Selector de Fecha Inicial y Fecha Final: Al ingresar el rango de fechas de la factura, la app calcula con precisión astronómica los días exactos transcurridos (por ejemplo, 30, 31 o 60 días).\n' +
    '• Modificación Manual: Si la factura especifica una cantidad fija de días (por ejemplo, 29 días por cambio de ciclo), puedes modificar el número de días directamente sin desconfigurar las fechas.\n' +
    '• Impacto: Los días son fundamentales porque determinan el coste total del Término de Potencia y el Alquiler del Contador.',
    60, 142, { width: 475 }
  );

  // Bloque B
  doc.rect(45, 240, 505, 145).fillAndStroke(lightBg, borderGrey);
  doc.fontSize(11).fillColor(accentRed).font('Helvetica-Bold').text('B. Potencias Contratadas (kW en P1 y P2)', 60, 252);
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    'En el sistema eléctrico español (tarifa 2.0TD), existen dos periodos horarios de potencia:\n' +
    '• Potencia Punta (P1): De 08:00 a 00:00 de lunes a viernes (no festivos). Es la potencia habitual de mayor coste.\n' +
    '• Potencia Valle (P2): De 00:00 a 08:00 todos los días y 24 horas en fines de semana y festivos nacionales.\n' +
    '• Regla práctica: La mayoría de hogares tienen la misma potencia en ambos tramos (ej. 4.60 kW y 4.60 kW), pero la aplicación permite ingresar valores asimétricos para clientes con coche eléctrico o tarifas optimizadas.',
    60, 272, { width: 475 }
  );

  // Bloque C
  doc.rect(45, 400, 505, 155).fillAndStroke(lightBg, borderGrey);
  doc.fontSize(11).fillColor(accentRed).font('Helvetica-Bold').text('C. Consumo de Energía Activa (kWh en P1, P2 y P3)', 60, 412);
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    'El consumo se divide en tres tramos horarios obligatorios:\n' +
    '• Punta (P1 - Horas caras): 10:00 a 14:00 y 18:00 a 22:00 (laborables).\n' +
    '• Llano (P2 - Horas intermedias): 08:00 a 10:00, 14:00 a 18:00 y 22:00 a 00:00.\n' +
    '• Valle (P3 - Horas económicas): 00:00 a 08:00 de lunes a viernes, y las 24 horas de sábados, domingos y festivos.\n' +
    '• Sumatorio Total: La app suma automáticamente los kWh de los 3 periodos y muestra el consumo global acumulado del periodo de facturación en tiempo real.',
    60, 432, { width: 475 }
  );

  // Sección 2
  doc.fontSize(16).fillColor(primaryColor).font('Helvetica-Bold').text('2. Precios Actuales del Cliente', 45, 575);
  doc.fontSize(9.5).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    'En la columna o pestaña "Factura Actual", introduce los precios que el cliente está pagando con su comercializadora actual (Endesa, Iberdrola, Naturgy, TotalEnergies, etc.):',
    45, 600, { width: 505 }
  );

  doc.rect(45, 630, 505, 130).fillAndStroke('#ffffff', '#cbd5e1');
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    '1. Precios de Potencia (€/kW/día): Introduce el precio contratado en P1 y P2. Admite hasta 6 decimales de precisión (ej. 0.103944 €/kW/día).\n' +
    '2. Precios de Energía (€/kWh): Introduce el precio por kWh para Punta (P1), Llano (P2) y Valle (P3). Si el cliente tiene tarifa plana 24h, introduce el mismo precio en los 3 tramos.\n' +
    '3. Alquiler de Contador: Importe mensual oficial (típicamente 0,81 € a 1,20 €/mes según equipo monofásico o trifásico).\n' +
    '4. Impuesto Eléctrico (IEE): Se aplica el coeficiente oficial vigente en España (por defecto 3,8% o 5,11269632%).',
    60, 645, { width: 475 }
  );

  // ==========================================
  // PÁGINA 3: COMPARATIVA, TARIFAS Y AHORRO
  // ==========================================
  doc.addPage();

  doc.fontSize(16).fillColor(primaryColor).font('Helvetica-Bold').text('3. Comparativa Inteligente y Tarifas ANSAMA', 45, 50);
  doc.fontSize(9.5).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    'Una vez ingresados los datos de la factura, la aplicación calcula simultáneamente el importe total con la tarifa actual y lo compara contra todas las tarifas del catálogo de ANSAMA:',
    45, 75, { width: 505 }
  );

  // Tabla explicativa de tarifas
  const tableTop = 115;
  doc.rect(45, tableTop, 505, 25).fill(primaryColor);
  doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold').text('Tarifa / Modalidad', 60, tableTop + 7);
  doc.text('Tipo de Precio', 200, tableTop + 7);
  doc.text('Perfil Ideal del Cliente', 330, tableTop + 7);

  const rows = [
    { name: 'ANSAMA Fija 24 Horas', type: 'Precio Estable (1 tramo)', desc: 'Para clientes que no quieren preocuparse por horarios.' },
    { name: 'ANSAMA 3 Periodos (P1/P2/P3)', type: 'Discriminación Horaria', desc: 'Ahorro máximo si concentran consumo en valle y fines de semana.' },
    { name: 'ANSAMA Indexada Mercado', type: 'Coste OMIE + Fee gestión', desc: 'Para pymes y usuarios que buscan el precio mayorista más bajo.' },
    { name: 'ANSAMA Solar / Batería Virtual', type: 'Autoconsumo + Excedentes', desc: 'Compensación de excedentes a precio preferente.' }
  ];

  let rY = tableTop + 25;
  rows.forEach((r, idx) => {
    const bg = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
    doc.rect(45, rY, 505, 32).fillAndStroke(bg, '#e2e8f0');
    doc.fontSize(8.5).fillColor(primaryColor).font('Helvetica-Bold').text(r.name, 60, rY + 10);
    doc.fontSize(8.5).fillColor(accentRed).font('Helvetica').text(r.type, 200, rY + 10);
    doc.fontSize(8).fillColor(secondaryColor).font('Helvetica').text(r.desc, 330, rY + 5, { width: 210 });
    rY += 32;
  });

  // Sección 4: Interpretación de Resultados
  doc.fontSize(16).fillColor(primaryColor).font('Helvetica-Bold').text('4. Cómo Interpretar los Resultados y el Ahorro', 45, 275);

  // Tarjeta Mejor Opción
  doc.rect(45, 305, 505, 100).fillAndStroke('#fef2f2', '#fecaca');
  doc.fontSize(11).fillColor(accentRed).font('Helvetica-Bold').text('★ La Tarjeta de "Mejor Opción"', 60, 318);
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(2.5).text(
    'La aplicación destaca de forma automática con un badge destacado la tarifa que representa el menor importe final para el cliente. En esta tarjeta verás:\n' +
    '• Total Factura ANSAMA: Importe neto final exacto (con impuestos e IVA incluidos).\n' +
    '• Ahorro en esta factura (€): Diferencia exacta respecto a la factura actual.\n' +
    '• Ahorro Anual Estimado (€/año): Proyección calculada multiplicando el ahorro por el ratio de días anuales (365 / días de factura).',
    60, 336, { width: 475 }
  );

  // Desglose de Factura
  doc.rect(45, 420, 505, 175).fillAndStroke(lightBg, borderGrey);
  doc.fontSize(11).fillColor(primaryColor).font('Helvetica-Bold').text('Desglose Concepto a Concepto', 60, 432);
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    'Al pulsar en "Ver Desglose", la aplicación despliega la auditoría contable completa:\n' +
    '1. Término de Potencia: [kW P1 × Días × Precio P1] + [kW P2 × Días × Precio P2].\n' +
    '2. Término de Energía: [kWh P1 × Precio P1] + [kWh P2 × Precio P2] + [kWh P3 × Precio P3].\n' +
    '3. Base Sujeta a IEE: Subtotal de Potencia + Subtotal de Energía.\n' +
    '4. Impuesto Eléctrico (IEE): Base Sujeta × Tipo impositivo (3,8% / 5,11%).\n' +
    '5. Alquiler de Equipo de Medida: Tarifa regulada por los días del periodo.\n' +
    '6. Base Imponible General: Potencia + Energía + IEE + Alquiler.\n' +
    '7. Impuesto sobre el Valor Añadido (IVA): Base Imponible × 21% (o tipo reducido).\n' +
    '8. TOTAL FACTURA: La cifra final a pagar que coincide con el recibo bancario.',
    60, 452, { width: 475 }
  );

  // ==========================================
  // PÁGINA 4: HISTORIAL, PWA Y MODO MÓVIL
  // ==========================================
  doc.addPage();

  doc.fontSize(16).fillColor(primaryColor).font('Helvetica-Bold').text('5. Historial, Guardado y "Nueva Comparativa"', 45, 50);

  doc.rect(45, 80, 505, 120).fillAndStroke(lightBg, borderGrey);
  doc.fontSize(10.5).fillColor(primaryColor).font('Helvetica-Bold').text('A. Guardar en el Historial de Comparativas', 60, 92);
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    '• Botón "Guardar Comparativa": Permite almacenar el estudio con el nombre del cliente o código de suministro (CUPS).\n' +
    '• Persistencia Local: El historial se almacena en la memoria segura del navegador (LocalStorage), lo que garantiza que nunca se pierden los datos aunque cierres la pestaña o apagues el ordenador.\n' +
    '• Carga con 1 Clic: Desde el botón "Historial", puedes ver la lista de estudios anteriores, la fecha de creación, el ahorro conseguido y recargar cualquier comparativa al instante.',
    60, 112, { width: 475 }
  );

  doc.rect(45, 215, 505, 100).fillAndStroke(lightBg, borderGrey);
  doc.fontSize(10.5).fillColor(accentRed).font('Helvetica-Bold').text('B. Botón "Nueva Comparativa / Poner a Cero"', 60, 227);
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    '• Para atender a un nuevo cliente sin mezclar consumos o precios antiguos, pulsa el botón rojo "Nueva / Poner a cero" en la cabecera.\n' +
    '• Cuadro de confirmación de seguridad: Evita que borres accidentalmente un estudio en curso.\n' +
    '• Al confirmar, todos los campos se restablecen limpiamente a los valores neutros de fábrica listos para un nuevo cálculo.',
    60, 247, { width: 475 }
  );

  // Sección 6: PWA y Móvil
  doc.fontSize(16).fillColor(primaryColor).font('Helvetica-Bold').text('6. Aplicación Móvil (PWA) e Instalación', 45, 335);

  doc.rect(45, 360, 505, 130).fillAndStroke('#ffffff', '#cbd5e1');
  doc.fontSize(10.5).fillColor(primaryColor).font('Helvetica-Bold').text('Instalación en Smartphone (Android / iOS):', 60, 372);
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    'La aplicación está desarrollada con tecnología Progressive Web App (PWA), lo que permite instalarla directamente en el teléfono sin necesidad de descargarla de tiendas de aplicaciones:\n' +
    '• En Chrome / Android: Pulsa el icono "Instalar App" en la barra de navegación o el botón del menú de Chrome "Añadir a pantalla de inicio". Se creará un icono con el logo de ANSAMA.\n' +
    '• En Safari / iPhone: Pulsa el botón "Compartir" (icono de flecha hacia arriba) y selecciona "Añadir a pantalla de inicio".\n' +
    '• Funcionamiento Offline: La aplicación se puede abrir y utilizar sin conexión a internet durante visitas comerciales a clientes sin cobertura.',
    60, 392, { width: 475 }
  );

  // Botón simulador móvil
  doc.rect(45, 505, 505, 95).fillAndStroke(lightBg, borderGrey);
  doc.fontSize(10.5).fillColor(accentRed).font('Helvetica-Bold').text('Simulador de Pantalla Móvil ("Ver Móvil")', 60, 517);
  doc.fontSize(9).fillColor(secondaryColor).font('Helvetica').lineGap(3).text(
    'En la cabecera dispones del botón "Ver Móvil". Al pulsarlo, se abre un marco interactivo que simula con total realismo cómo ve la aplicación un cliente en su teléfono móvil (dimensiones iPhone/Android, barras táctiles, teclado numérico y selector por pestañas). Es ideal para demostraciones comerciales en pantalla grande.',
    60, 537, { width: 475 }
  );

  // Cuadro final de contacto
  doc.rect(45, 625, 505, 140).fillAndStroke('#0f172a', '#0f172a');
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold').text('ANSAMA Energía • Compromiso de Eficiencia', 60, 645);
  doc.fontSize(9).fillColor('#94a3b8').font('Helvetica').lineGap(3).text(
    'Este comparador es una herramienta de asesoramiento profesional. Para cualquier duda de tarificación especial, clientes industriales (tarifas 3.0TD y 6.1TD) o integración de baterías y autoconsumo fotovoltaico, consulte directamente con el equipo técnico de ANSAMA.',
    60, 668, { width: 475 }
  );
  doc.fontSize(9.5).fillColor('#f87171').font('Helvetica-Bold').text('Web Oficial: ansama.es  •  Soporte: info@ansama.es', 60, 725);

  // Aplicar encabezados y pies de página a todas las páginas calculadas
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    drawHeader(i + 1);
    drawFooter(i + 1, range.count);
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

createManualPDF()
  .then((file) => {
    const stats = fs.statSync(file);
    console.log(`PDF generated successfully: ${file} (${stats.size} bytes)`);
  })
  .catch((err) => {
    console.error('Error generating PDF:', err);
    process.exit(1);
  });

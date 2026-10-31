// Posiciones, horarios y rutas de cada agente (código, no base de datos).
// El texto y el estado en vivo salen de la tabla agents.
export const DATA: Record<string, any> = {
 "marta": {
  "name": "Marta Ribas",
  "mono": "MR",
  "role": "Jefe de gabinete",
  "zone": "Despacho",
  "st": "active",
  "bubble": "Armando el resumen semanal",
  "mission": "Recoge lo que dejan los demás y te manda un único resumen semanal, ordenado por lo que necesita tu atención.",
  "wakes": "Una vez por semana y cuando se lo pidas",
  "reads": "Los informes de todo el equipo",
  "can": "Solo leer y redactar el resumen",
  "last": "Resumen de la semana (ejemplo)",
  "style": "Directa. Te lo cuenta en tres líneas y sin rodeos.",
  "seat": [
   127,
   106
  ],
  "shift": [
   [
    525,
    1170
   ]
  ],
  "weekend": [
   [
    6,
    1140,
    1180
   ]
  ],
  "kf": [
   [
    0.0,
    127,
    106
   ],
   [
    18.0,
    127,
    106
   ],
   [
    19.17,
    215,
    106
   ],
   [
    20.72,
    215,
    222
   ],
   [
    22.92,
    380,
    222
   ],
   [
    23.68,
    380,
    165
   ],
   [
    33.68,
    380,
    165
   ],
   [
    34.44,
    380,
    222
   ],
   [
    38.71,
    700,
    222
   ],
   [
    40.79,
    700,
    66
   ],
   [
    48.79,
    700,
    66
   ],
   [
    50.87,
    700,
    222
   ],
   [
    51.27,
    730,
    222
   ],
   [
    52.23,
    730,
    150
   ],
   [
    60.23,
    730,
    150
   ],
   [
    61.19,
    730,
    222
   ],
   [
    68.05,
    215,
    222
   ],
   [
    69.6,
    215,
    106
   ],
   [
    70.77,
    127,
    106
   ]
  ],
  "cyc": 70.77,
  "off": 0,
  "run": null
 },
 "dani": {
  "name": "Dani Costa",
  "mono": "DC",
  "role": "Entrenamiento",
  "zone": "Planta Vida",
  "st": "active",
  "bubble": "Ajustando tu plan de la semana",
  "mission": "Propone la semana de entrenos según tu carga y tu descanso, y avisa si ve sobrecarga.",
  "wakes": "Cuando Strava registra una actividad, y una vez por semana",
  "reads": "Actividades de Strava; sueño si llega desde Coros",
  "can": "Proponer; la decisión es tuya",
  "last": "Plan semanal (ejemplo)",
  "style": "Motivador, pero te dice la verdad sobre tu descanso.",
  "seat": [
   205,
   548
  ],
  "shift": [
   [
    450,
    1230
   ]
  ],
  "weekend": [
   [
    5,
    540,
    720
   ],
   [
    6,
    540,
    720
   ]
  ],
  "kf": [
   [
    0.0,
    205,
    548
   ],
   [
    14.0,
    205,
    548
   ],
   [
    15.51,
    95,
    520
   ],
   [
    33.51,
    95,
    520
   ],
   [
    35.03,
    205,
    548
   ],
   [
    41.03,
    205,
    548
   ],
   [
    41.49,
    170,
    548
   ],
   [
    45.84,
    170,
    222
   ],
   [
    52.91,
    700,
    222
   ],
   [
    54.99,
    700,
    66
   ],
   [
    60.99,
    700,
    66
   ],
   [
    63.07,
    700,
    222
   ],
   [
    70.13,
    170,
    222
   ],
   [
    74.48,
    170,
    548
   ],
   [
    74.95,
    205,
    548
   ]
  ],
  "cyc": 74.95,
  "off": 20,
  "run": [
   95,
   520
  ]
 },
 "laia": {
  "name": "Laia Serra",
  "mono": "LS",
  "role": "Finanzas",
  "zone": "Planta Vida",
  "st": "sleeping",
  "bubble": "Vigilando tus posiciones en Finexa",
  "mission": "Vigila tus posiciones en Finexa y te avisa de caídas fuertes o exceso de concentración. Informa y plantea escenarios, no recomienda comprar.",
  "wakes": "Comprobación diaria con umbrales; el modelo solo entra si salta uno",
  "reads": "Finexa, con acceso de solo lectura",
  "can": "Solo leer y avisar",
  "last": "Sin avisos recientes (ejemplo)",
  "style": "Prudente. Prefiere callar a dar una falsa alarma.",
  "seat": [
   87,
   291
  ],
  "shift": [
   [
    540,
    1080
   ]
  ],
  "weekend": [],
  "kf": null,
  "cyc": 0,
  "off": 0,
  "run": null
 },
 "pau": {
  "name": "Pau Ferrer",
  "mono": "PF",
  "role": "Carrera",
  "zone": "Planta Vida",
  "st": "building",
  "bubble": "Vacante: ofertas de backend en Suiza",
  "mission": "Vigilaría ofertas de backend en Suiza y mantendría al día tu plan y tu CV.",
  "wakes": "Una vez por semana",
  "reads": "Ofertas públicas y tu plan de carrera",
  "can": "Proponer borradores",
  "last": "Todavía no existe",
  "style": "Metódico. Todo con fechas y enlaces.",
  "seat": [
   237,
   291
  ],
  "shift": null,
  "weekend": [],
  "kf": null,
  "cyc": 0,
  "off": 0,
  "run": null
 },
 "nuria": {
  "name": "Núria Vidal",
  "mono": "NV",
  "role": "Tiempo",
  "zone": "Planta Vida",
  "st": "building",
  "bubble": "Vacante: tu jornada y tus horas",
  "mission": "Cruzaría tu calendario con tu jornada y tus vacaciones para que sepas cómo vas de horas.",
  "wakes": "Cada mañana",
  "reads": "Google Calendar",
  "can": "Solo leer",
  "last": "Todavía no existe",
  "style": "Puntual hasta el minuto.",
  "seat": [
   387,
   291
  ],
  "shift": null,
  "weekend": [],
  "kf": null,
  "cyc": 0,
  "off": 0,
  "run": null
 },
 "alex": {
  "name": "Àlex Roca",
  "mono": "AR",
  "role": "Operaciones",
  "zone": "Planta Vetra",
  "st": "active",
  "bubble": "Revisando los despliegues de Vetra",
  "mission": "Revisa despliegues, registros de errores y avisos de seguridad de Vetra, y solo te molesta si hay algo.",
  "wakes": "Cada mañana, y ante un despliegue fallido",
  "reads": "Render, Vercel y Supabase, solo lectura",
  "can": "Solo leer y avisar",
  "last": "Todo en orden (ejemplo)",
  "style": "Calmado. Si te escribe, es de verdad.",
  "seat": [
   687,
   291
  ],
  "shift": [
   [
    510,
    1050
   ]
  ],
  "weekend": [
   [
    5,
    540,
    1380
   ],
   [
    6,
    540,
    1380
   ]
  ],
  "kf": [
   [
    0.0,
    687,
    291
   ],
   [
    20.0,
    687,
    291
   ],
   [
    21.11,
    770,
    291
   ],
   [
    25.92,
    770,
    652
   ],
   [
    27.19,
    865,
    652
   ],
   [
    41.19,
    865,
    652
   ],
   [
    42.45,
    770,
    652
   ],
   [
    48.19,
    770,
    222
   ],
   [
    49.12,
    700,
    222
   ],
   [
    51.2,
    700,
    66
   ],
   [
    57.2,
    700,
    66
   ],
   [
    59.28,
    700,
    222
   ],
   [
    60.21,
    770,
    222
   ],
   [
    61.13,
    770,
    291
   ],
   [
    62.24,
    687,
    291
   ]
  ],
  "cyc": 62.24,
  "off": 33,
  "run": null
 },
 "biel": {
  "name": "Biel Soler",
  "mono": "BS",
  "role": "Código",
  "zone": "Planta Vetra",
  "st": "active",
  "bubble": "PR listo para tu revisión",
  "mission": "Revisa ramas y PRs de Vetra, propone tests con Jest y clasifica errores.",
  "wakes": "Al abrirse un PR",
  "reads": "Los repositorios MiMesa_Backend y MiMesa_Frontend",
  "can": "Proponer PRs; nunca toca producción",
  "last": "Un PR propuesto, a la espera de tu revisión (ejemplo)",
  "style": "Perfeccionista con los tests.",
  "seat": [
   537,
   291
  ],
  "shift": [
   [
    570,
    1110
   ]
  ],
  "weekend": [],
  "kf": [
   [
    0.0,
    537,
    291
   ],
   [
    25.0,
    537,
    291
   ],
   [
    26.11,
    620,
    291
   ],
   [
    30.97,
    620,
    656
   ],
   [
    42.97,
    620,
    656
   ],
   [
    48.76,
    620,
    222
   ],
   [
    51.96,
    380,
    222
   ],
   [
    52.72,
    380,
    165
   ],
   [
    62.72,
    380,
    165
   ],
   [
    63.48,
    380,
    222
   ],
   [
    66.68,
    620,
    222
   ],
   [
    67.6,
    620,
    291
   ],
   [
    68.71,
    537,
    291
   ]
  ],
  "cyc": 68.71,
  "off": 61,
  "run": null
 },
 "julia": {
  "name": "Júlia Mas",
  "mono": "JM",
  "role": "Marketing",
  "zone": "Planta Vetra",
  "st": "active",
  "bubble": "Borrador de la página de precios",
  "mission": "Redacta textos para la web, ideas de captación y pruebas de precio de los planes.",
  "wakes": "Una vez por semana",
  "reads": "Datos de uso de Vetra",
  "can": "Borradores; publicas tú",
  "last": "Borrador de texto para la web (ejemplo)",
  "style": "Creativa, pero siempre con una métrica en la mano.",
  "seat": [
   837,
   291
  ],
  "shift": [
   [
    570,
    1050
   ]
  ],
  "weekend": [],
  "kf": [
   [
    0.0,
    837,
    291
   ],
   [
    22.0,
    837,
    291
   ],
   [
    22.89,
    770,
    291
   ],
   [
    23.81,
    770,
    222
   ],
   [
    25.61,
    905,
    222
   ],
   [
    26.91,
    905,
    125
   ],
   [
    34.91,
    905,
    125
   ],
   [
    36.2,
    905,
    222
   ],
   [
    38.0,
    770,
    222
   ],
   [
    43.79,
    770,
    656
   ],
   [
    44.99,
    680,
    656
   ],
   [
    56.99,
    680,
    656
   ],
   [
    58.19,
    770,
    656
   ],
   [
    63.05,
    770,
    291
   ],
   [
    63.95,
    837,
    291
   ]
  ],
  "cyc": 63.95,
  "off": 47,
  "run": null
 },
 "oriol": {
  "name": "Oriol Pons",
  "mono": "OP",
  "role": "Soporte",
  "zone": "Planta Vetra",
  "st": "building",
  "bubble": "Vacante: incidencias y retención",
  "mission": "Clasificaría incidencias y detectaría restaurantes que dejan de usar la app.",
  "wakes": "Al llegar una incidencia",
  "reads": "Vistas de lectura de la base de datos de Vetra",
  "can": "Solo leer y proponer respuestas",
  "last": "Todavía no existe",
  "style": "Paciente con todo el mundo.",
  "seat": [
   552,
   441
  ],
  "shift": null,
  "weekend": [],
  "kf": null,
  "cyc": 0,
  "off": 0,
  "run": null
 }
};

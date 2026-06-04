#!/bin/bash

# Verificar que se proporcionó el archivo de entrada
if [ $# -ne 1 ]; then
    echo "Uso: $0 <archivo_entrada.txt>"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="videos.json"

# Verificar existencia del archivo
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Error: El archivo '$INPUT_FILE' no existe."
    exit 1
fi

# 1. Limpia saltos de carro (\r) si proviene de Windows
# 2. Usa jq para leer líneas, eliminar comillas externas, agrupar en pares y generar JSON
sed 's/\r$//' "$INPUT_FILE" | jq -Rn '[
  inputs | select(length > 0) | ltrimstr("\"") | rtrimstr("\"")
] | [
  range(0; length; 2) as $i |
  { id: .[$i], title: .[$i+1] }
]' > "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Conversión exitosa. Archivo generado: $OUTPUT_FILE"
else
    echo "❌ Error al generar el JSON. Verifica el formato del archivo de entrada."
    exit 1
fi

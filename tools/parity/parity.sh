#!/usr/bin/env bash
# Renders the reference page and the Next.js export with the same spec, then diffs every frame.
# usage: parity.sh <reference.html> <export-url> <spec.json> <outdir>
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
ref=$1 url=$2 spec=$3 out=$4
rm -rf "$out"; mkdir -p "$out/ref" "$out/next" "$out/diff"
node "$here/capture.mjs" "$ref" "$out/ref" "$spec" >/dev/null
node "$here/capture.mjs" "$url" "$out/next" "$spec" >/dev/null
status=0
for f in "$out"/ref/*-*.png; do
  name=$(basename "$f"); [[ $name == sheet-* ]] && continue
  n="$out/next/$name"
  if [[ ! -f $n ]]; then echo "MISSING $name"; status=1; continue; fi
  if [[ $(magick identify -format '%wx%h' "$f") != $(magick identify -format '%wx%h' "$n") ]]; then
    echo "SIZE    $name ref=$(magick identify -format '%wx%h' "$f") next=$(magick identify -format '%wx%h' "$n")"; status=1; continue
  fi
  px=$(magick compare -metric AE -fuzz 3% "$f" "$n" "$out/diff/$name" 2>&1 >/dev/null | awk '{print $1}') || true
  total=$(magick identify -format '%[fx:w*h]' "$f")
  awk -v px="$px" -v total="$total" -v name="$name" 'BEGIN { printf "%-8s %-34s %10.0f px differ (%.4f%%)\n", (px + 0 == 0 ? "SAME" : "DIFF"), name, px, px * 100 / total }'
  [[ ${px%.*} -eq 0 ]] || status=1
done
exit $status

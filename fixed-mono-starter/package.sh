#!/bin/sh
# Packages the Fixed Mono Starter mod for import into Mindustry.
# Output: build/fixed-mono-starter.zip, containing mod.hjson and scripts/main.js at the archive root.
# Entry order is sorted and timestamps are normalized, so repeated runs produce the same archive bytes.
set -eu

cd "$(dirname "$0")"

out="build/fixed-mono-starter.zip"
stage="build/.stage"

rm -rf build
mkdir -p "$stage/scripts"

cp mod.hjson "$stage/mod.hjson"
cp scripts/main.js "$stage/scripts/main.js"

find "$stage" -exec touch -t 200001010000 {} +
(cd "$stage" && find mod.hjson scripts -type f | LC_ALL=C sort | zip -X -D -q ../fixed-mono-starter.zip -@)
rm -rf "$stage"

echo "wrote $out"

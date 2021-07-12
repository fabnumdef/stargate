#!/usr/bin/env bash

for f in src/images/*.mmd; do
  [ -f "$f" ] || break;
   mmdc -i $f -o ${f%.mmd}.png -s 5;
 done

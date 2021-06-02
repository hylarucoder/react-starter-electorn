#!/bin/bash
set -e
DIR_ROOT="$( cd "$( dirname "$0" )" && pwd )/../"

mode=${mode:=production}

DIR_ELECTRON="$DIR_ROOT/packages/totalfinder-electron"
DIR_WEB="$DIR_ROOT/packages/totalfinder-web"

echo "===> 准备 Electron "
cd "$DIR_ELECTRON"
yarn vite build --mode $mode
yarn tsc src/preload.ts --outFile dist/preload.js
cp ./package.json ./dist

echo "===> 准备 Renderer"
cd "$DIR_WEB"
yarn vite build --mode $mode
cp -r ./dist "$DIR_ELECTRON/dist/renderer"

echo "===> 打包 Electron"
cd "$DIR_ELECTRON"
yarn electron-builder -c ./electron-builder.json -mlw


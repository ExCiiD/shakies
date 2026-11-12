#!/usr/bin/env bash
# Construit Shakies.apk sans Gradle : aapt2 (ressources) -> javac -> d8 (dex) -> zipalign -> apksigner.
# Relance ce script après chaque modification de index.html pour regénérer l'APK :
#   bash android/build-apk.sh
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$HERE")"
SDK="${ANDROID_SDK:-/d/DEV/android-sdk}"
BT="$SDK/build-tools/34.0.0"
JAR="$SDK/platforms/android-34/android.jar"
export JAVA_HOME="${JAVA_HOME:-/c/Program Files/Microsoft/jdk-17.0.21.21-hotspot}"
export PATH="$JAVA_HOME/bin:$PATH"
w(){ cygpath -w "$1"; }

# Dossier de travail sans espace (le projet est dans « Smoothies app »)
OUT="$SDK/_build/shakies"
rm -rf "$OUT"; mkdir -p "$OUT/assets/www" "$OUT/classes" "$OUT/dex"
cp -r "$HERE/src" "$HERE/res" "$HERE/AndroidManifest.xml" "$OUT/"

# 1. l'app web devient les assets de l'APK
cp "$ROOT/index.html" "$ROOT/chefskiss.js" "$ROOT/chefskiss-data.js" "$ROOT/icon.svg" "$ROOT/manifest.webmanifest" "$OUT/assets/www/"

# 2. ressources (icône adaptative) + manifeste
"$BT/aapt2.exe" compile --dir "$(w "$OUT/res")" -o "$(w "$OUT/res.zip")"
"$BT/aapt2.exe" link -I "$(w "$JAR")" --manifest "$(w "$OUT/AndroidManifest.xml")" \
  --min-sdk-version 26 --target-sdk-version 34 -o "$(w "$OUT/unsigned.apk")" "$(w "$OUT/res.zip")"
# assets ajoutés avec jar (aapt2 -A sous Windows écrit des chemins avec « \ » qu'Android ne lit pas)
(cd "$OUT" && jar -uf unsigned.apk assets)

# 3. code Java -> classes -> dex
cd "$OUT"
javac -nowarn -Xlint:-options -source 8 -target 8 -bootclasspath "$(w "$JAR")" -d classes $(find src -name '*.java')
cmd //c "$(w "$BT/d8.bat") --min-api 26 --lib $(w "$JAR") --output dex $(find classes -name '*.class' | tr '\n' ' ')"

# 4. on ajoute classes.dex dans l'APK
(cd dex && jar -uf ../unsigned.apk classes.dex)

# 5. alignement + signature (clé créée une seule fois : à garder pour pouvoir mettre à jour l'app)
"$BT/zipalign.exe" -f -p 4 unsigned.apk aligned.apk
KS="$HERE/shakies-release.jks"; PROPS="$HERE/keystore.properties"
if [ ! -f "$KS" ]; then
  PASS="$(head -c 48 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 20)"
  printf 'storePassword=%s\nkeyAlias=shakies\n' "$PASS" > "$PROPS"
  keytool -genkeypair -keystore "$(w "$KS")" -alias shakies -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "$PASS" -keypass "$PASS" -dname "CN=Shakies, O=Shakies, C=RE" >/dev/null 2>&1
fi
PASS="$(grep storePassword "$PROPS" | cut -d= -f2)"
cp "$KS" ks.jks
cmd //c "$(w "$BT/apksigner.bat") sign --ks ks.jks --ks-key-alias shakies --ks-pass pass:$PASS --out signed.apk aligned.apk"
cmd //c "$(w "$BT/apksigner.bat") verify signed.apk"
rm -f ks.jks
cp signed.apk "$ROOT/Shakies.apk"
echo "OK -> $ROOT/Shakies.apk ($(du -h "$ROOT/Shakies.apk" | cut -f1))"

# ropa
Assignment Web1

# Kriterien

- Alle Funktionen können komplett ohne externe Bibliotheken implementiert werden. Verwende keine externen Frameworks. Dies ermöglicht es Studierenden, ohne Erfahrung mit den jeweiligen Frameworks, das Peer-Review durchzuführen und erleichtert die Korrektur.
- Funktionsumfang
- Clean-Code
    - Event Bubbling
    - HTML Semantik
    - Namensgebung
    - Dead Code
    - Dup Code
    - Stylelint, ESlint
- Architektur und Struktur
    - Unabhängiger Gameservice
    - Berechnungen im Gameservice
    - SPA
- Generell
    - Responsive
    - Keine Fehler, Warnungen oder Konsolenmeldungen

# Pendenzen

## Schritt 1: Offline-Version
Folgende Funktionen sind für Schritt 1 zu implementieren.

### Startseite
- Lokale Rangliste darstellen (maximal 10 Einträge). Zwei Spieler:innen mit der gleichen Anzahl Siege haben den gleichen Rang.
- Eingabe des Namens
- Spiel starten, wenn ein Name eingegeben wurde

### Spielseite
- Name des oder der Spieler:in darstellen
- Mögliche Hände darstellen
- Auswahl der Hand. Es sind fünf Hände (Schere, Stein, Papier, Brunnen, Streichholz) verfügbar sein.
- Wahl des Computers anzeigen. Der Computer wählt seine Hand per Zufall.
- Resultat des Spiels anzeigen

Nach jedem Spiel ist eine Wartezeit einzuhalten, während der keine Eingaben möglich sind. Das Spielergebnis soll während er Wartezeit sichtbar sein. Die Wartezeit ist optional bei Schritt 1 und verpflichtend bei Schritt 2.

Die History zeigt alle Spiele der aktuellen Session. Beim Neuladen darf die lokale History verloren gehen. Das Speichern, zum Beispiel mittels Local Storage, ist optional.

- Zurück zur Startseite

## Schritt 2: Online-Version
Im Schritt 2 kommuniziert die App mit dem Game-Server. Der Game-Server wird folgendermassen angesprochen:

- Wechseln zwischen lokalem und Servermodus
- Anzeigen der Rangliste vom Server oder lokal (maximal 10 Einträge).

### Spielseite

- Das Spiel nutzt den korrekten Service nutzen (lokal oder Game-Service).
- Zwischen den Spielen muss eine Wartezeit eingehalten werden (siehe Beschreibung oben).
- Ein Modus ist ausreichend. Wählen Sie zwischen "Stein Schere Papier Echse Spock" oder "Stein Schere Papier Brunnen Streichholz"

# Befehl	Beschreibung

```
npm run stylelint
```

Testet die CSS-Dateien gegen die hinterlegten Regeln.

```
npm run eslint
```

Testet die JS-DAteien gegen die hinterlegten Regeln.

```
npm run all
```

Führt Tests für CSS/JS aus.

```
npm start
```

Startet die Webseite.

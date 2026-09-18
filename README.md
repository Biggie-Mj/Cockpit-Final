# Cockpit V1.5 — package GitHub Pages root-safe

Version conçue pour être déposée directement à la racine du dépôt GitHub Pages.

## V1.5

- Spotlights : retard calculé par rapport au joueur le plus servi ; orange à partir de 2, rouge à partir de 5.
- Menaces et situations : une injection peut être annulée depuis COMPOSANTS pour rendre l’élément disponible à nouveau.
- FX Strong Start : reste affiché environ 5,5 secondes et peut être fermé immédiatement en touchant l’écran.
- Sessions : 15 emplacements utilisateur maximum (la démo ne consomme pas d’emplacement). Le bouton de sauvegarde propose de mettre à jour l’emplacement courant, créer un nouvel emplacement ou écraser une sauvegarde existante.
- AJOUTER retiré de la navigation : les créations sont maintenant intégrées à chaque onglet de COMPOSANTS.
- PNJ : création et import JSON depuis Fichiers, avec prise en charge d’un ou plusieurs PNJ dans le même fichier.
- Lieux : nouvel onglet COMPOSANTS, création et import JSON depuis Fichiers. Le bouton d’import est aussi présent en haut de l’éditeur ouvert par + Lieu.
- Maintien des correctifs iPadOS V1.2/V1.3 : viewport standalone, safe areas, barre d’état et bandeau supérieur.

## Formats d’import

PNJ : `{ "format":"cockpit-npcs", "formatVersion":1, "npcs":[ ... ] }`

Champs PNJ : `name`, `role`, `identity`, `wants`, `fears`, `knows`, `hides`, `trait`.

Lieux : `{ "format":"cockpit-locations", "formatVersion":1, "locations":[ ... ] }`

Champs lieu : `name`, `tier`, `concept`, `visuals`, `impulse`, `situation`, `faction`, `localPlot`, `regionalPlot`, `mainPlot`, `danger`, `reward`, `ifIgnored`.

L’application accepte aussi un objet unique ou un tableau JSON brut pour ces deux imports. Les identifiants internes sont recréés à l’import.


## V1.5
- La démo contient un journal de partie illustratif.
- Chaque ligne du journal peut être modifiée ou effacée individuellement.
- Export texte chronologique du journal via le bouton Export.


## V2.0.4 — Icônes et chronomètre
- Remplacement des principaux symboles/emoji de navigation et d’action par les PNG dorés fournis.
- Strong Start en TABLE : halo jaune-orangé animé tant qu’il n’est pas joué.
- Chronomètre H:MM:SS après lancement de la session, pause via sablier, STOP avec confirmation OUI/NON.

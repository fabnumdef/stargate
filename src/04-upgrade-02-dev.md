# Mise à niveau environnement local dev

Afin de mettre à niveau l'environnement local, il suffit de récupérer la nouvelle version de code et exécuter les éventuelles migrations de données.

## Backend & Frontend

Pour mettre à niveau chaque projet, il faut :

* Mettre à jour le code via `git pull`
* Mettre à niveau les dépendances via `npm install`
* Build si nécessaire via `npm run build --if-present`
* Lancer les migrations si nécessaire via `npm run migrations:up --if-present`
* Relancer l'application

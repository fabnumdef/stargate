# Mise à niveau environnement DevSecOps

L'environnement Igloo tire avantage des `hooks` [helm](https://helm.sh) afin d'avoir des actions déclanchées automatiquement suivant le cycle de vie de l'application. Rien n'est à prévoir.

- Au `pre-upgrade` et `pre-install`, le script `npm run migrations:up --if-present` est exécuté
- Au `post-install`, le script `npm run fixtures:load --if-present` est exécuté
- Au `post-delete`, la base de données est supprimée

## Astuces

Pour forcer le système à recréer les fixtures, il suffit de stop l'environnement puis le recréer. Toutes les données seront perdues
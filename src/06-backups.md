# Backups

L'application Stargate sauvegarde la totalité des données dans MongoDB. Ainsi, il s'agit du seul point à sauvegarder.

## Base de données

Il est _possible_ sur mongodb de faire une sauvegarde directe des fichiers de la base de données ou de les snapshot via le système de fichier afin de faire des sauvegardes incrémentales.

Autrement, utilisez les outils CLI dédiés comme `mongodump`.

Vous pouvez alors copier le dossier de base de données. Pour trouver ce dossier, regardez la clef `storage.dbPath` dans `/etc/mongod.conf`.
Par défaut `/var/lib/mongo`.

### Test de cohérence et de réintégration après un backup du système de fichier

Via docker installé, le plus simple est de créer des conteneurs à la volée pour faire un repair et lancer `mongod` dans la foulée.
Ici, $PATH_TO_BACKUP correspond au répertoire où la base de données a été téléchargée.

```bash
docker run --rm -it -v $PATH_TO_BACKUP:/data/db mongo:latest mongod --repair
docker run --rm -it -p 27017:27017 -v $PATH_TO_BACKUP:/data/db mongo:latest mongod
```

Pour pousser le test, il suffit de comparer le nombre de documents dans chaque collection.

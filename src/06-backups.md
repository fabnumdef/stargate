# Backups

L'application Stargate sauvegarde la totalité des données dans MongoDB. Ainsi, il s'agit du seul point à sauvegarder.

## Base de données

Il est _possible_ sur mongodb de faire une sauvegarde directe des fichiers de la base de données ou de les snapshot via le système de fichier afin de faire des sauvegardes incrémentales.

Autrement, utilisez les outils CLI dédiés comme `mongodump`.

Vous pouvez alors copier le dossier de base de données. Pour trouver ce dossier, regardez la clef `storage.dbPath` dans `/etc/mongod.conf`.
Par défaut `/var/lib/mongo`.
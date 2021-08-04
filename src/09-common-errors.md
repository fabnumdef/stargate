# Procédures de corrections d'erreurs fréquentes

## MongoDB

### La Base de données ne se lance plus

Après un arrêt secteur inopiné du VPS, il peut y avoir une désynchronisation qui empêche WiredTiger de récupérer correctement les données, et mongodb de se lancer.

Attention : N'hésitez pas à copier la base de données via `rsync` ou `dd` afin d'avoir une copie des fichiers corrompu en cas d'échec de la réparation.

Pour résoudre ça :
```bash
systemctl stop mongodb
mongod -f /etc/mongod.conf --repair
systemctl start mongodb
```

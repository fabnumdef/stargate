# Mise à niveau sur un VPS CentOS

Cette documentation cible la mise à niveau sur un VPS avec CentOS 8.

Dans le présent document, vous trouverez certaines variables, qui sont utilisées comme en `bash` dont voici les références :
| Nom de la variable | Description |
|--------------------|-------------|
|     VERSION        | Version à installer, format vMAJEUR.MINEUR.PATCH |
| IP_VPS | L'ip du serveur VPS cible |
| PATH_ARCHIVE | Contient le nom du dossier (ou le path absolu) vers le dossier où on va décompresser les fichiers du livrable |
| BACKEND_DOMAIN | Le nom de domaine dns du backend |
| FRONTEND_DOMAIN | Le nom de domaine dns du frontend |

## Téléchargement

Stargate étant opensource, le téléchargement se fait via la liste des releases sur internet.
Rendez-vous sur [la page des releases du dépôt de documentation](https://gitlab.com/fabnum-minarm/stargate/docs/-/releases), pour chaque version, il y a une liste de packages, avec une archive `.tar.bz2`.

Utilisez `scp` pour envoyer l'archive sur le VPS.
Décompressez l'archive grâce à la commande `mkdir $PATH_ARCHIVE && tar -C $PATH_ARCHIVE -xjf stargate_${VERSION}.tar.bz2 && cd $PATH_ARCHIVE`

### Mettre à niveau le backend

Pour installer le backend, nous allons :
* Déplacer le backend dans son répertoire
* Nous placer dans ce répertoire
* Lancer un rebuild des modules `npm` pour s'assurer qu'ils soient compatibles avec le système linux et la version de node.
* Exécuter `npm run migrations:up --if-present` afin d'exécuter d'éventuelles migrations automatiques
* Relancer dans pm2

```bash
rsync -a --remove-source-files ${PATH_ARCHIVE}/stargate_backend /opt/stargate/backend
cd /opt/stargate/backend
npm rebuild
npm run migrations:up --if-present
pm2 restart backend
```

### Mettre à niveau le frontend

Pour installer le frontend, nous allons :
* Déplacer le frontend dans son répertoire
* Nous placer dans ce répertoire
* Lancer un rebuild des modules `npm` pour s'assurer qu'ils soient compatibles avec le système linux et la version de node.
* Relancer dans pm2

```bash
rsync -a --remove-source-files ${PATH_ARCHIVE}/stargate_frontend /opt/stargate/frontend
cd /opt/stargate/frontend
npm rebuild
pm2 restart frontend
```

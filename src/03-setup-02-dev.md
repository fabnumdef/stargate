# Installation sur poste de développement

Cette procédure d'installation vaut pour un environnement local, dans lequel aucune résilience est requise.  
Il est réputé acquis que toutes les données peuvent être perdues.

## Prérequis

Tout d'abord, il faudra installer quelques prérequis :

* Linux ou Windows avec sous système linux. Il est théoriquement possible de faire tourner le projet sur Windows mais le présent document ne traite pas ce cas.
* Git
* libc, gcc pour la compilation de certaines dépendances

### NodeJS

Si NodeJS n'est pas déjà installé, nous recommandons l'utilisation de [fnm](https://github.com/Schniz/fnm) via la procédure manuelle.
Notez qu'il est préférable, dans un environnement sécurisé, de ne pas utiliser de script bash directement exécuté depuis internet.
Une fois installé, vous pourrez exécuter les commandes suivantes :
```bash
fnm install 14 # Installe la version 14, actuelle LTS
fnm use 14 # Utilise la version 14, actuelle LTS dans l'environnement courant
fnm default 14 # Mets la version 14 par défaut (optionnel) 
```

### MongoDB

Si MongoDB n'est pas installé, vous pouvez l'installer ou bien le lancer via Docker.

#### Installation locale

Nous utilisons MongoDB Community Edition, vous trouverez les procédures d'installation sur [le site officiel](https://docs.mongodb.com/manual/installation/).

#### Installation via Docker

Si Docker est installé au préalable, vous pouvez utiliser directement les commandes suivantes :
```bash
mkdir -p ./mongodb/data/db # Créer un répertoire pour persister la base de données.
docker run --name stargate_mongo -p 27017:27017 -v `pwd`/mongodb/data/db:/data/db -d mongo:5.0 # Créé et lance un conteneur
```

## Web API (Backend)

Pour installer ce projet, il faut :

* Cloner le projet [backend](https://gitlab.com/fabnum-minarm/stargate/backend)
* Mettre à niveau les dépendances via `npm install`
* Build si nécessaire via `npm run build --if-present`
* Lancer les migrations si nécessaire via `npm run migrations:up --if-present`
* Lancer l'application via la commande `npm run dev`

## Web App (Frontend)

Pour installer cet projet, il faut :

* Cloner le projet [frontend](https://gitlab.com/fabnum-minarm/stargate/frontend)
* Mettre à niveau les dépendances via `npm install`
* Build si nécessaire via `npm run build --if-present`
* Lancer l'application via la commande `npm run dev`

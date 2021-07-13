# Installation locale

Pour installer Stargate sur un environnement local, sans docker, pour le développement, il faudra installer chacun des 2 projets.

## Prérequis

Tout d'abord, il faudra installer quelques prérequis : 

* MongoDB >= 3.8
* NodeJS >= 12
* Git

## Web API

Pour installer cet projet, il faut :

* Cloner le projet [backend](https://gitlab.com/fabnum-minarm/stargate/backend)
* Installer les dépendances via la commande `npm install`
* Modifier la configuration config.json à votre guise
* Lancer l'application via la commande `npm run dev`

## Web App

Pour installer cet projet, il faut :

* Cloner le projet [frontend](https://gitlab.com/fabnum-minarm/stargate/frontend)
* Installer les dépendances via la commande `npm install`
* Définir une variable d'environnement API_URL contenant le chemin vers la web API.
* Lancer l'application via la commande `npm run dev`

# Technologies

La motivation dans le choix des technologies pour ce projet fut d’une part, de choisir des technologies fiables, limitant le périmètre de connaissances techniques et la courbe d'apprentissage pour le personnel non familier (permettant de faciliter les recrutements).

D'autre part, certaines technologies ont été sélectionnées afin de bénéficier de leur scalabilité permettant de donner à la solution une haute disponibilité si désirée.

## Backend

### Web API

La web API est écrite en Javascript et fonctionne sur NodeJS >= 12.

* babel-node sert à convertir le code ES6 vers ES5, nodeJS est en mesure de le faire à partir de la version 12, cependant babel est utilisé pour permettre une utilisation sans douleur des modules ES6 dans NodeJS. Cette dépendance pourrait être retirée quand NodeJS supportera mieux les modules ES6.
* Pino sert à générer les logs.
* Koa permet de décrire le routing de l'API, décrire le comportement CORS ou encore parser le contenu JSON entrant.
* Apollo est utilisé en tant que serveur graphQL.
* ESLint garantit le format de code.
* Jest est utilisé afin de lancer les tests unitaires.
* Mongoose est utilisé comme ORM pour faciliter l'exploitation de la base de données.

### Base de données

Le système de base de données utilisé est MongoDB. 
Il s'agit d'une base de données no-SQL, dite schemaless, c'est-à-dire qu'elle ne requiert pas la définition d'un schéma en amont. Notre utilisation de MongoDB reste basique : écriture / lecture / agrégation.

Notre utilisation de MongoDB reste basique : écriture / lecture / aggrégation.

## Frontend

### ReactJS & NextJS

NextJS est utilisé pour permettre un rendu serveur du code (SSR).

## Intégration & système

### Docker

Docker est utilisé afin de construire des conteneurs Linux pouvant être exécutés localement, en préproduction et en production. Il est utilisé pour garantir l'idempotence de déploiement entre deux conteneurs linux.

### Kubernetes

Kubernetes est utilisé pour les besoins du développement, en créant un environnement dédié à chaque branche créée pour faciliter les tests et les recettes.

### Gitlab CI

Gitlab est utilisé pour son système d'intégration continue / déploiement continue afin de vérifier le code, lancer les tests unitaires, construire et héberger les images docker ainsi qu’orchestrer les déploiements automatiques sur Kubernetes.

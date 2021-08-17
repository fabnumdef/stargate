# Environnement CI/CD gitlab

L'environnement CI/CD est simplifié par [Igloo](https://igloo.fabnum.fr).
Le runner qui traite les tâches est également hébergé dans les clusters [Igloo](https://igloo.fabnum.fr).

## Clusters

Deux clusters Igloo existent, un pour la production et un pour le développement. Ils sont traités différemment :
- Les données du cluster de développement sont réputées volatiles.
- Le cluster de développement héberge également les runners de CI.

## Workflows

Dans les grandes lignes, nous suivons le [gitlab flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html) :

* À la création d'une nouvelle branche, un environnement non dédié est créé.  
  Non dédié signifie que l'espace de nom Kubernetes, dans lequel est hébergé la solution, est partagé avec les autres environnements stargate créés au même moment. L’espace mémoire et CPU réservé sont partagés entre tous les environnements dits de review. La base de données est également partagée.
* Au merge sur develop, un environnement est dédié est créé.
* Au tag, un environnement dédié est créé sur l'environnement de production.
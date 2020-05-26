# Backend / State machine

Pour assurer l'ordre d'exécution, le backend génère à la volée des machines d'états. Il s'agit de cycles de travail.

Une machine statique est générée par demande.

Une machine dynamique est générée pour chaque sous demande (visiteur).
Cette machine créée des états à la volée, comportant des étapes parallèles pour chaque unité, avec les passages étapes liées aux unités.


## État général d'une demande

Une demande en elle-même, qui regroupe plusieurs sous demandes de visiteur, possède sa propre machine afin de récupérer facilement son état Actuel.

```
                                            +-----------+
                                   +------->+ Accepted  |
                                   |        +-----------+
                                   |
                                   |
           +---------+     +-------+-+      +---------+
           | Drafted +---->+ Created +----->+ Mixed   |
           ++--------+     +----+--+-+      +---------+
            |                   |  |
            |                   |  |
            |                   |  |        +----------+
            |                   |  +------->+ Rejected |
            |                   |           +----------+
            |                   v
##########  |              +----+-----+
#Removed #<-+              | Canceled |
##########                 +----------+

```

Ici, nous avons plusieurs états enregistrés dans l'état de la demande, l'état "Removed", quant à lui n'existe pas, il correspond à la suppression de l'entrée de base de données.

| État | Modifiable | Description |
|------|------------|-------------|
| Drafted | Oui ✅ | Il s'agit de l'étape pendant laquelle la demande a été créée en base, mais pendant laquelle aucune étape de validation n'a été commencée. |
| Created | Non ❌ | Il s'agit de l'étape pendant laquelle les sous demandes de visiteur sont en attente de validation |
| Canceled | Non ❌ | La demande a été annulée par la personne qui en est à l'origine. Toutes les vérifications en attente sont annulées. |
| Accepted | Non ❌ | Toutes les demandes filles ont été acceptées. |
| Mixed | Non ❌ | Certaines demandes filles ont été acceptées, les autres ont été refusées |
| Rejected | Non ❌ | Toutes les demandes filles ont été refusées. |

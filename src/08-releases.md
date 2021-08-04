# Procédure de publication de versions

## Numéros de versions

Le projet utilise une [gestion sémantique de version](https://semver.org/lang/fr/spec/v2.0.0.html).

Ce qu'il faut retenir :

* Les versions comprennent trois parties _MAJEUR_._MINEUR_._CORRECTIF_
* Quand un incrément du _CORRECTIF_ est fait, il suffit de mettre à jour les sources et relancer le logiciel
* Quand un incrément du _MINEUR_ est fait, il suffit de mettre à jour les sources, lancer le script de migration, et relancer le logiciel
* Quand un incrément du _MAJEUR_ est fait, il y aura une attention particulière à apporter à la procédure de migration, des changements manuels seront probables, une incompatibilité de données pouvant exister

## Procédure de création de version

Trois dépôts existent : le backend, le frontend, et le meta-dépôt. Pour créer une version il suffit de :

1. Créer un tag avec `npm version` sur le backend
2. Créer un tag avec `npm version` sur le frontend
3. Créer un tag avec de la forme `vMAJEUR.MINEUR.CORRECTIF` via `git` ou l'interface gitlab sur le meta-dépôt, uniquement quand les releases backend et frontend auront été créées via leurs CI respectives
4. Le meta-dépôt ira chercher les versions du même numéro sur le backend et frontend, il est important qu'elles soient identiques.
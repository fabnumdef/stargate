# Intégration mindef connect

Attention : La documentation ici présente est le fruit de rétro-ingénierie, en l'absence de documentation officielle en accès libre.

## Implémentation

L'implémentation sur stargate du protocole openid est partielle, on se contente de récupérer un jeton, d'introspecter deans pour récupérer l'email, afin de générer un jeton JWT stargate

```mermaid
sequenceDiagram
  autonumber
  participant Browser as Navigateur de l'utilisateur (Firefox)
  participant FFS as Front du Fournisseur de Service (SPA)
  participant BFS as Backend du Fournisseur de Service (NodeJS)
  participant FI as Fournisseur d'identité (keycloak)
  
  Note over Browser,FI: Au lancement du serveur
  BFS->>FI: Requête le well known afin de récupérer la configuration openid (discover)
  
  Note over Browser,FI: Pour se connecter
  Browser->>FFS: Chargement de page de login
  Browser->>Browser: Clic sur le bouton "Connexion"
  Browser->>FI: Accède à la page d'authentification
  Browser->>Browser: Entre identifiants et se connecte / utilise SPNEGO
  FI->>Browser: Réponds en 30x pour rediriger sur l'url de redirection avec les informations de connexion en query params
  Browser->>FFS: <redirect-uri>?state=xxxx&code=xxx&...
  FFS->>BFS: Envoie le code au Backend, pour que ce dernier requete les jetons
  BFS->>FI: Echange le code contre deux jetons : Access et Refresh
  BFS->>FI: Lire le JWT directement pouvant être une mauvaise pratique, le Backend va demander au FI les informations
  BFS->>FFS: Génère un jeton JWT
```

## Configuration Keycloak

Pour pouvoir utiliser keycloak pour tester l'implémentation, il faut :

1. Créer un _realm_
2. Créer un _client_
    1. Passer ce _client_ en type "confidentiel"
    2. Définir des Redirect URI autorisées
3. Créer un _utilisateur_
    1. Définir un mot de passe sur cet _utilisateur_
4. Configurer les variables du backend avec :
    1. L'URL du _realm_
    2. L'ID du _client_
    3. Le secret du _client_
    
Plus de détails sur la méthode de configuration dans [la documentation Igloo](https://fabnum-minarm.gitlab.io/igloo/docs/third-party/mindef-connect.html).
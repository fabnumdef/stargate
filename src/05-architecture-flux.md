# Matrices de flux

La matrice de flux est très dépendante de comment est installé l'application.

## Installation avec conteneurisation

| Source | Destination | Port(s) | Protocole | Description |
|--------|-------------|---------|-----------|-------------|
|Client|Proxy|80/443*|HTTP/HTTPS*|Accès web utilisateur|
|Backend|Serveur SMTP|587 (ou autre port SMTP)|SMTP|Envoie des notifications mail |
|Backend|MongoDB|27017|TCP|Connexion DB|
|Proxy|Backend|3000|HTTP|Le backend est accessible via le proxy|
|Proxy|Frontend|3000|HTTP|Le frontend est accessible via le proxy|
|Frontend|Backend|3000|HTTP|Le frontend interroge le backend pour le rendu coté serveur|

Complément d'informations : Le projet remonte logs et metrics

| Source | Destination | Port(s) | Protocole | Description |
|--------|-------------|---------|-----------|-------------|
|Administrateur|Proxy|443|HTTP/HTTPS|Accès web|
|Proxy|Grafana|80|HTTP|Le monitoring est accessible via le proxy|
|Grafana|Prometheus|9090|HTTP|Requete les métriques|
|Prometheus|InfluxDB|8086|HTTP|TimeSeries database|
|Prometheus|Backend|9091|HTTP|Scrape métriques|
|Prometheus|Frontend|9091|HTTP|Scrape métriques|

## Installation classique

| Source | Destination | Port(s) | Protocole | Description |
|--------|-------------|---------|-----------|-------------|
|Client|Nginx|80/443*|HTTP/HTTPS*|Accès web utilisateur|
|Client|SSH|22|SSH|Accès administration SSH|
|Backend|Serveur SMTP|587 (ou autre port SMTP)|SMTP|Envoie des notifications mail |

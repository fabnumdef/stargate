# Installation sur VPS CentOS

## Introduction

Cette documentation cible l'installation sur un VPS avec CentOS 7, avec un minimum d'interactions sur internet, afin de servir de base pour une installation dans un environnement hors réseau.

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

## Installation des prérequis

Pour s'exécuter correctement, babel (utilisé dans le backend) a besoin du fichier `libc.musl-x86_64.so.1`.
Pour l'ajouter, vous trouverez deux packages musl-libc à installer, il faudra ensuite faire un lien symbolique, le tout via les commandes suivantes : 
```bash
rpm -i ${PATH_ARCHIVE}/binaries/musl-filesystem-*.rpm
rpm -i ${PATH_ARCHIVE}/binaries/musl-libc-*.rpm
ln -s /usr/lib64/libc.so.6 /usr/lib64/libc.musl-x86_64.so.1
```

Le package `policycoreutils-python` sera requis si les commandes `checkmodule` et `semodule_package` ne sont pas disponibles.
Le package `bzip2` sera requis pour décompresser les archives .tar.bz2

## Installation de MongoDB

Dans le dossier de binaires se trouve un fichier .rpm (for RPM Package Manager) compatible avec CentOS.
Pour l'installer, rien de plus simple : `rpm -i ${PATH_ARCHIVE}/binaries/mongodb-org-server-*.rpm`

Une fois installé, assurez vous que le service sera actif au démarrage avec la commande suivante.

```bash
systemctl start mongod # Lance le service
systemctl enable mongod # Lance le service au démarrage
```

### Configurer SELinux pour MongoDB

Une fois installé, il faut créer les règles SELinux suivantes :
* `search` dans `mongod_t` > `cgroup_t` > `dir`
* `getattr`, `open`, `read` dans `mongod_t` > `cgroup_t` > `file`
* `open`, `read` dans `mongod_t` > `proc_net_t` > `file`
* `search` dans `mongod_t` > `sysctl_net_t` > `dir`

Ainsi que le fichier `mongodb_stargate.te` suivant : 
```selinux
module mongodb_stargate 1.0;

require {
    type cgroup_t;
    type proc_net_t;
    type sysctl_net_t;
    type mongod_t;
    class file { getattr open read };
    class dir search;
}

#============= mongod_t ==============

allow mongod_t cgroup_t:dir search;
allow mongod_t cgroup_t:file { getattr open read };
allow mongod_t proc_net_t:file { open read };
allow mongod_t sysctl_net_t:dir search;
allow mongod_t sysctl_net_t:file { open getattr read };
```

Puis lancez les commandes suivantes : 
```bash
checkmodule -M -m -o mongodb_stargate.mod mongodb_stargate.te
semodule_package -o mongodb_stargate.pp -m mongodb_stargate.mod
semodule -i mongodb_stargate.pp
```

### Désactiver les _Transparent Huge Pages_

Pour s'assurer de la configuration à chaque démarrage, créez un service systemd en ajoutant le contenu suivant au fichier `/etc/systemd/system/disable-transparent-huge-pages.service` :

```toml
[Unit]
Description=Disable Transparent Huge Pages (THP)
DefaultDependencies=no
After=sysinit.target local-fs.target
Before=mongod.service
[Service]
Type=oneshot
ExecStart=/bin/sh -c 'echo never | tee /sys/kernel/mm/transparent_hugepage/enabled > /dev/null'
[Install]
WantedBy=basic.target
```

Ensuite, lancez les commandes suivantes :
```bash
systemctl daemon-reload # Charge le fichier nouvellement créé
systemctl start disable-transparent-huge-pages # Lance le service
systemctl enable disable-transparent-huge-pages # Lance le service au démarrage
```

Afin de vérifier la bonne configuration, la commande suivante devrait retourner "never"
```bash
cat /sys/kernel/mm/transparent_hugepage/enabled
```

_Sur CentOS 8 uniquement_, quelques configurations supplémentaires sont nécessaires pour le virtual-guest.

Créez le répertoire avec la commande suivante : 
```bash
mkdir -p /etc/tuned/virtual-guest-no-thp
```

Ajoutez ensuite le contenu suivant au fichier `/etc/tuned/virtual-guest-no-thp/tuned.conf` :
```toml
[main]
include=virtual-guest
[vm]
transparent_hugepages=never
```

Activez enfin le profile tout juste créé avec cette commande : 
```bash
tuned-adm profile virtual-guest-no-thp
```

## Installation de NodeJS

Pour installer NodeJS depuis l'exécutable présent dans le dossier `binaries`, utilisez la commande suivante : 
```bash
export NODE_TAR_NAME=$(basename ${PATH_ARCHIVE}/binaries/node-*.tar.xz .tar.xz)
tar -C /usr/local/bin/ --strip-components=2 -xf ${PATH_ARCHIVE}/binaries/${NODE_TAR_NAME}.tar.xz ${NODE_TAR_NAME}/bin/
tar -C /usr/local/lib/ --strip-components=2 -xf ${PATH_ARCHIVE}/binaries/${NODE_TAR_NAME}.tar.xz ${NODE_TAR_NAME}/lib/
```

Pour tester, le plus simple est de vérifier les versions via :
```bash
node --version
npm --version
```

## Installation de PM2

PM2 est un outil de gestion de processus pour NodeJS.

```bash
export NODE_LIB_PATH=$(npm list -g --depth=0 | head -1)
tar -C $NODE_LIB_PATH/node_modules -xjf ${PATH_ARCHIVE}/binaries/pm2.tar.bz2 # Décompresse la librairie
ln -s $NODE_LIB_PATH/node_modules/pm2/bin/pm2* /usr/local/bin/ # Créé des liens symboliques vers pm2
```

Vérifiez sa bonne installation avec la commande suivante :
```bash
pm2 -v
```

### Ajouter un service systemd
Pour assurer le lancement au démarrage, nous allons là encore créer un service systemd, mais cette fois pm2 va être en mesure de le faire directement via la commande suivante : 

```bash
pm2 startup # Va créer le fichier /etc/systemd/system/pm2-root.service
```

### Configurer SELinux pour PM2

Pour faire communiquer correctement, il faut ajouter la règle suivante : 
* `open`,`read`,`unlink`,`write` dans `init_t` > `admin_home_t` > `file`  

Pour cela, créez un fichier `pm2_systemd.te` avec le contenu suivant :
```selinux
module pm2_systemd 1.0;

require {
    type admin_home_t;
    type init_t;
    class file { open read unlink write };
}

#============= init_t ==============
allow init_t admin_home_t:file { open read unlink write };
```

Il est alors possible d'ajouter la règle via les commandes suivantes : 
```bash
checkmodule -M -m -o pm2_systemd.mod pm2_systemd.te
semodule_package -o pm2_systemd.pp -m pm2_systemd.mod
semodule -i pm2_systemd.pp
```

## Installer le code de Stargate

Nous allons utiliser le dossier `/opt/stargate` pour placer le backend et le frontend du projet.
Créons le dossier d'abord via `mkdir` :
```bash
mkdir -p /opt/stargate
```

### Installer le backend

Pour installer le backend, nous allons : 
* Déplacer le backend dans son répertoire
* Nous placer dans ce répertoire
* Lancer un rebuild des modules `npm` pour s'assurer qu'ils soient compatibles avec le système linux et la version de node.
* Exécuter `npm run migrations:up --if-present` afin d'exécuter d'éventuelles migrations automatiques
* Ajouter dans pm2

```bash
mv ${PATH_ARCHIVE}/stargate_backend /opt/stargate/backend
cd /opt/stargate/backend
npm rebuild
HOST=127.0.0.1 PROMETHEUS_EXPORTER=0 pm2 start npm --name 'backend' -- start
```

#### Personnaliser la configuration

La configuration se fait via des variables d'environnement. Il suffit de les exporter dans le shell courant, avant de mettre à jour les variables prises en compte par `pm2`.

Il est ensuite possible ensuite de lister les variables d'environnement prises en compte avec `pm2 env`

```bash
export MONGODB=mongodb://localhost:27017/stargate
export MAIL__DEFAULT_FROM= # Expéditeur des emails
export MAIL__TRANSPORTER__HOST= # Nom de domaine du serveur mail
export MAIL__TRANSPORTER__PORT= # Port du serveur mail
export MAIL__TRANSPORTER__AUTH__PASS= # Mot de passe pour l'authentification mail
export MAIL__TRANSPORTER__AUTH__USER= # Utilisateur pour l'authentification mail
export TOKEN__SECRET=$(tr -dc 'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 128 ) # Va être utilisé comme preuve cryptographique pour les jetons JWT
export WEBSITE_URL=https://${FRONTEND_DOMAIN}
pm2 restart backend --update-env
pm2 env $(pm2 ls | grep backend | awk -F'│' '{print $2}') # Vérifier
```

### Installer le frontend

Pour installer le frontend, nous allons :
* Déplacer le frontend dans son répertoire
* Nous placer dans ce répertoire
* Lancer un rebuild des modules `npm` pour s'assurer qu'ils soient compatibles avec le système linux et la version de node.
* Ajouter dans pm2

```bash
mv ${PATH_ARCHIVE}/stargate_frontend /opt/stargate/frontend
cd /opt/stargate/frontend
npm rebuild
PORT=3001 HOST=127.0.0.1 PROMETHEUS_HOST=127.0.0.1 pm2 start npm --name 'frontend' -- start -- --host 127.0.0.1
```

#### Mettre à jour l'API URL

La configuration se fait via des variables d'environnement. Il suffit de les exporter dans le shell courant, avant de mettre à jour les variables prises en compte par `pm2`.

Il est ensuite possible ensuite de lister les variables d'environnement prises en compte avec `pm2 env`
```bash
export API_URL=https://${BACKEND_DOMAIN}/api
pm2 restart frontend --update-env
pm2 env $(pm2 ls | grep frontend | awk -F'│' '{print $2}') # Vérifier
```

## Nginx

Installons nginx avec `rpm -i ${PATH_ARCHIVE}/binaries/nginx-*.rpm`.

### Configuration

Éditons le fichier `/etc/nginx/nginx.conf` comme suit :
```nginx
# For more information on configuration, see:
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;
}
```

Pour la configuration du backend, éditons le fichier `/etc/nginx/conf.d/backend.conf`  
Attention, modifiez bien le $BACKEND_DOMAIN dans le fichier avec le nom de domaine du frontend
```nginx
server {
  listen 80;
  server_name $BACKEND_DOMAIN;
  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_set_header X-NginX-Proxy true;

    proxy_pass http://localhost:3000;
    proxy_redirect http://localhost:3000/ http://$server_name/;
  }
}
```

Pour la configuration du frontend, éditons le fichier `/etc/nginx/conf.d/frontend.conf`  
Attention, modifiez bien le $FRONTEND_DOMAIN dans le fichier avec le nom de domaine du frontend
```nginx
server {
  listen 80;
  server_name $FRONTEND_DOMAIN;
  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_set_header X-NginX-Proxy true;

    proxy_pass http://localhost:3001;
    proxy_redirect http://localhost:3001/ http://$server_name/;
  }
}
```

### Configurons SELinux

Pour nginx, le plus simple est de configurer SELinux via la commande `setsebool -P httpd_can_network_connect on`

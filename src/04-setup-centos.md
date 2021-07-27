# Installation sur CentOS

## Introduction


# Règles SELinux (Dockerless)

## MongoDB

Créer trois règles pour _allow_ :  
_mongod_t > cgroup_t > dir_  
Règles : _search_  
_mongod_t > cgroup_t > file_  
Règles : _getattr_, _open_, _read_  
_mongod_t > proc_net_t > file_  
Règles : _open_, _read_  


## PM2

Créer une règle pour _allow_ :  
_init_t > admin_home_t > file_  
Règles : _open, read, unlink, write_

## Nginx

Modifier le boolean _httpd_can_network_connect_ à _true_.

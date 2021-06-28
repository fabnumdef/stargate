# How to deploy using this script ?

## Requirements

- Install Ansible locally
- Install Docker locally
- Create inventory file with variables
    - acme_email=
    - api_url= 
    - app_url=

## This script will

- Install python/ansible on the distant server
- Install Docker on the distant server
- Upgrade the distant server 
- Build images locally
- Upload images
- Load images
- Create configs files
- Start docker-compose file

## Run it !

```bash
ansible-playbook -i inventory_prod.ini playbook.yml
```
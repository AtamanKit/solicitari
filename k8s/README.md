# Kubernetis Organisation

* ### 1. Deployment Files:
    * web-deployment.yaml
    * api-deployment.yaml
    * daphne-deployment.yaml
    * db-deployment.yaml
    * redis-deployment.yaml
    * nginx-deployment.yaml

* ### 2. Service Files:
    * web-service.yaml
    * api-service.yaml
    * daphne-service.yaml
    * db-service.yaml
    * redis-service.yaml
    * nginx-service.yaml

* ### 3. ConfigMaps and Secrets:
    * **ConfigMaps**
        * web-configmap.yaml
        * api-configmap.yaml
        * daphne-configmap.yaml
        * nginx-configmap.yaml
    * **Secrets**
        * db-secrets.yaml
        * redis-secrets.yaml
        * api-secrets.yaml
        * web-secrets.yaml
        * nginx-secrets.yaml

* ### 4. Persistent Volumes and Claims:
    * db-persistentvolumeclaim.yaml
    * redis-persistentvolumeclaim.yaml

* ### Ingress Configuration
    * nginx-ingress.yaml
&nbsp;
<br/>
&nbsp;
<br/>
&nbsp;

# Docker Images
We will need to create docker images for using them in the Pods Containers in the Deployments files. All the commands will be run from the `solicitari/` directory

```bash
# `web` Deployment
docker build -f Dockerfile.prod -t solicitari-web:1.0 ./frontend

# `api` Deployment
docker build -f Dockerfile.prod -t solicitari-api:1.0 ./backend

# `daphne` Deployment
docker build -f Dockerfile.prod -t solicitari-daphne:1.0 ./backend

# `nginx` Deployment
docker build -t solicitari-nginx:1.0 ./nginx
```

# Directories and Files Structure

```bash
k8s/
│
├── deployments/
│   ├── web-deployment.yaml
│   ├── api-deployment.yaml
│   ├── daphne-deployment.yaml
│   ├── db-deployment.yaml
│   ├── nginx-deployment.yaml
│   └── redis-deployment.yaml
│
├── services/
│   ├── web-service.yaml
│   ├── api-service.yaml
│   ├── daphne-service.yaml
│   ├── api-service.yaml
│   ├── db-service.yaml
│   └── redis-service.yaml
│
├── configmaps/
│   ├── web-configmap.yaml
│   └── api-configmap.yaml
│
└── secrets/
    └── api-secret.yaml
```

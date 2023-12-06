# Kubernetis Organisation

* ### 1. Deployment Files:
    * api-deployment.yaml
    * daphne-deployment.yaml
    * db-deployment.yaml
    * nginx-deployment.yaml
    * redis-deployment.yaml
    * web-deployment.yaml

* ### 2. Service Files:
    * api-service.yaml
    * daphne-service.yaml
    * db-service.yaml
    * nginx-service.yaml
    * redis-service.yaml

* ### 3. ConfigMaps and Secrets:
    * **ConfigMaps**
        * api-configmap.yaml
        * db-configmap.yaml
        * web-configmap.yaml
    * **Secrets**
        * api-secrets.yaml
        * daphne-secret.yaml
        * db-secrets.yaml
        * redis-secrets.yaml

* ### 4. Persistent Volumes and Claims:
    * backend-media-pvc.yaml
    * backend-static-pvc.yaml
    * postgres-pvc.yaml
    * react-build-pvc.yaml

* ### 5. Incress
    * **cert-manager**
        * certificate.prod.yaml
        * certificate.staging.yaml
        * letsencrypt-issuer.prod.yaml
        * letsencrypt-issuer.staging.yaml
    * **ingress-service**
        * ingress.dev.yaml
        * ingress.prod.yaml
&nbsp;
<br/>
&nbsp;
<br/>
&nbsp;

# Docker Images
We will need to create docker images for using them in the Pods Containers in the Deployments files. All the commands will be run from the `solicitari/` directory

```bash
# The action will be triggered from `root/` directory (`solicitari/`)

# `api` Deployment
docker build -f .backend/Dockerfile.prod -t solicitari-api:1.0 ./backend

# `daphne` Deployment
# docker build -f .backend/Dockerfile.prod -t solicitari-daphne:1.0 ./backend

# `web` Deployment
docker build -f .backend/Dockerfile.prod -t solicitari-web:1.0 ./frontend

# `nginx` Deployment
docker build -f ./nginx/Dockerfile.k8s -t solicitari-nginx:1.0 ./nginx
```

# Directories and Files Structure

```bash
k8s
├── configmaps
│   ├── api-configmap.yaml
│   ├── db-configmap.yaml
│   └── web-configmap.yaml
├── deployments
│   ├── api-deployment.yaml
│   ├── daphne-deployment.yaml
│   ├── db-deployments.yaml
│   ├── nginx-deployment.yaml
│   ├── redis-deployment.yaml
│   └── web-deployment.yaml
├── ingress
│   ├── cert-manager
│   │   ├── certificate.prod.yaml
│   │   ├── certificate.staging.yaml
│   │   ├── letsencrypt-issuer.prod.yaml
│   │   └── letsencrypt-issuer.staging.yaml
│   └── ingress-service
│       ├── ingress.dev.yaml
│       └── ingress.prod.yaml
├── pvc
│   ├── backend-media-pvc.yaml
│   ├── backend-static-pvc.yaml
│   ├── postgres-pvc.yaml
│   └── react-build-pvc.yaml
├── README.md
├── secrets
│   ├── api-secret.yaml
│   ├── daphne-secret.yaml
│   ├── db-secret.yaml
│   └── redis-secret.yaml
├── services
│   ├── api-service.yaml
│   ├── daphne-service.yaml
│   ├── db-service.yaml
│   ├── nginx-service.yaml
│   └── redis-service.yaml
└── utils
    └── temp-pod.yaml

```

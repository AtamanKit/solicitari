# Kubernetis Organisation
Kubernetes manifest files are organized in directories and files that will look like this:
### Directories and Files Structure

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
# Minikube
If dealing locally or using a single VM we first should install Minikube then start Minikube:
```bash
minikube start

# The previous command will start a Docker Minikube environment that we'll to connect to:
eval $(minikube docker-env)
```
# Docker Images
What we'll need to do next is to create Docker Images for using them in the Pods Containers in the Deployments files. All the commands will be run from the `solicitari/` directory.

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
# PVCs, Secrets, ConfigMaps
Before applying deployments we will create PVCs, Secrets and ConfigMaps looking at the Directories and Files Structure and using the commands:
```bash
# Applying PVCs from `k8s/pvc` directory
kubectl apply -f k8s/pvc

# Applying Secrets from `k8s/secrets` directory
kubectl apply -f k8s/secrets

# Applying ConfigMaps from `k8s/configmaps` directory
kubectl apply -f k8s/configmaps
```

# Fill up PVCs with contents
### Postgres PVC
This is a PVC that will keep tracking of our changes in the main Postgres Database. We will create a Temporary Pod: `k8s/utils/temporary-pods/temp-postgres-pvc.yaml` apply it:
```bash
kubectl apply -f k8s/utils/temporary-pods/temp-postgres-pvc.yaml
```
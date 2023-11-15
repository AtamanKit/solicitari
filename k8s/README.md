# Kubernetis Organisation

* ### 1. Deployment Files:
    * web-deployment.yaml
    * api-deployment.yaml
    * daphne-deployment.yaml
    * db-deployment.yamk
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

# Directories and Files Structure

```bash
/k8s    # Root directory
    |_ /deployments
        |_ /web-deployment.yaml
        |_ /api-deployment.yaml
        |_ /daphne-deployment.yaml
        |_ /db-deployment.yaml
        |_ /redis-deployment.yaml
        |_ /nginx-deployment.yaml
```

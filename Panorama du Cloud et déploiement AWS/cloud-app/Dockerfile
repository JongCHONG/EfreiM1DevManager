#le but est de retracer les étapes de construction, installation et exécution de l'application, voir screenshot.

FROM node:20

WORKDIR /app
# Set the working directory to /app

COPY . . 
# Copy all node files to the same directory as the Dockerfile/WORKDIR

RUN npm install

EXPOSE 3000

CMD ["node", "app.js"]

#Pour construire l'image Docker, exécutez la commande suivante:
#docker build -t cloud-app .

#Pour vérifier que l'image a été créée, exécutez la commande suivante:
#docker images

#Pour exécuter l'image Docker, exécutez la commande suivante:
#docker run -d -p 3000:3000 cloud-app:latest 
#<portLocal>:<portContainer>
#latest si jamais on a plusieurs versions de l'image

#Pour vérifier que le conteneur est en cours d'exécution, exécutez la commande suivante:
#docker ps/docker container ls

#Pour vérifier que l'application est en cours d'exécution, ouvrez un navigateur et accédez à l'URL suivante:
#http://localhost:3000

#Pour voir les logs
#docker logs -f jolly_spence (NAMES après docker ps)

#Pour arrêter le conteneur, exécutez la commande suivante:
#docker stop jolly_spence

#Pour changer le nom du tag
#docker image tag cloud-app:latest ghcr.io/<username>/cloud-app:1.0

#Pour pousser l'image sur le registre
#docker push ghcr.io/<username>/cloud-app:1.0

#Pour assigner le token d'accès personnel à une variable d'environnement sur mac/linux
#export pat=<Personal Access Token>

#Pour se connecter au registre sur mac/linux
#echo $pat | docker login ghcr.io -u <username> --password-stdin

#Pour assigner le token d'accès personnel à une variable d'environnement sur windows
#set %PAT%=<Personal Access Token>

#Pour se connecter au registre sur windows
#echo %PAT% | docker login ghcr.io -u <username> --password-stdin


#Kubernetes

#Lister les nodes
#kubectl get nodes

#Lister les pods
#kubectl get pods

#afficher les logs d'un pod
#kubectl logs <pod-name>

#kubectl get deployments

#deployer l'application
#kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
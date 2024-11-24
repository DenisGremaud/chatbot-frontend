# Frontend du projet chatbot

## Introduction

Ce git contient le code du frontend du projet chatbot. Il fait partie de mon projet de bachelor. Le but de ce projet est de créer un chatbot qui permet de répondre à des questions sur des données statistiques. Le chatbot sera capable de répondre à des questions sur des données statistiques provenant de l'annuaire statistique de l'Université de Lausanne ainsi que de faire des graphiques.

## Technologies utilisées

Le frontend est écrit en JavaScript et utilise le framework React. React est une bibliothèque JavaScript pour la construction d'interfaces utilisateur. Le projet utilise également la librairie Material-UI pour les composants graphiques. Les interactions avec le backend pour la partie chat en temps réel sont gérées par la librairie Socket.io. Tandis que les interactions avec le backend pour autre chose que le chat se fera via des requêtes HTTP. Pour la gestion des routes, le projet utilise React Router. De plus, le projet utilise TypeScript pour le typage.

## Installation

Le frontend est utilisé via un environnement Node.js. Pour le créer le projet, il suffit de lancer les commandes suivantes :

```bash
# Créer un projet React avec TypeScript & installer Material-UI
npx create-react-app . --template typescript
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# Installer React Router
npm install react-router-dom
npm install --save-dev @types/react-router-dom

# Installer Scoket.io
npm install socket.io-client
```

## Utilisation

Le frontend est accessible en développement sur le port 3000. Pour accéder au frontend, il suffit de lancer un navigateur web et d'aller à l'adresse suivante : [http://localhost:3000](http://localhost:3000).

Pour lancer le frontend, il suffit de lancer la commande suivante :

```bash
npm start
```

Pour build le frontend, il suffit de lancer la commande suivante :

```bash
npm run build
```

# Throw Trash in the Ocean

Multiplayer ocean-trashing simulation made for my DCC Capstone.

![Screenshot of game page](docs/screenshot_01.png)

## Setup and Run

### Deploy locally

    # Backend
    cd backend
    yarn install
    npm install -g nodemon
    nodemon server.js

    # Frontend
    cd client
    yarn install
    yarn start

### Deploy with Docker Compose

	docker-compose up --build
FROM node:18-slim

WORKDIR /app

# Copiamo i file necessari
COPY package.json ./

# Installiamo le dipendenze (ora funzionerà perché la versione è corretta)
RUN npm install

# Copiamo il resto dei file
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]

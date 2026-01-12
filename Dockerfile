FROM node:18-bullseye-slim

# Installiamo gli strumenti necessari per compilare pacchetti complessi
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamo i file delle dipendenze
COPY package.json ./

# Pulizia cache e installazione forzata
RUN npm cache clean --force
RUN npm install

# Copiamo tutto il resto del codice
COPY . .

# Usiamo la porta 8000 che è lo standard di Koyeb
EXPOSE 8000

CMD ["node", "server.js"]

# Usa un'immagine leggera di Node.js
FROM node:18-slim

# Installa le librerie necessarie per il sistema (fondamentali per alcune estensioni)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Crea la cartella dell'app
WORKDIR /app

# Copia i file delle dipendenze
COPY package*.json ./

# Installa le dipendenze (incluse quelle di Consumet)
RUN npm install --production

# Copia tutto il resto del codice
COPY . .

# Esponi la porta (Koyeb userà questa)
EXPOSE 8000

# Avvia l'addon usando la variabile PORT di Koyeb
CMD ["node", "server.js"]

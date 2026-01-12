FROM node:18-slim

WORKDIR /app

# Copia solo il file delle dipendenze
COPY package.json ./

# Installa le dipendenze ignorando avvisi e cache
RUN npm install --no-audit

# Copia il resto dei file
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]

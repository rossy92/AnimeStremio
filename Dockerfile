# Cambiamo da 18 a 20-slim
FROM node:20-slim

WORKDIR /app

# Installiamo i pacchetti direttamente per evitare errori di versioni
RUN npm init -y && \
    npm install stremio-addon-sdk axios cheerio @consumet/extensions

# Copiamo i tuoi file
COPY . .

# Impostiamo la porta corretta
ENV PORT=8000
EXPOSE 8000

CMD ["node", "server.js"]

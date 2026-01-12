FROM node:18-slim

WORKDIR /app

# Copia i file
COPY package.json ./

# Installazione forzata dei pacchetti uno ad uno
RUN npm install stremio-addon-sdk axios cheerio @consumet/extensions

# Copia il resto
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]

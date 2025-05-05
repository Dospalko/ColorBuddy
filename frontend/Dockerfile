# Stage 1: Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Skopíruj package.json a package-lock.json (alebo yarn.lock)
COPY package*.json ./

# Nainštaluj závislosti
RUN npm install

# Skopíruj zvyšok kódu aplikácie
COPY . .

# Spusti build pre produkciu (Vite vytvorí statické súbory v /dist)
# RUN npm run build # Toto odkomentuj pre produkčný build

# Stage 2: Development stage (pre lokálny vývoj s hot-reloading)
# Tento Dockerfile je primárne pre dev, pre produkciu by si použil build vyššie
# a servoval /dist napr. cez Nginx alebo `serve` package

# Port pre Vite dev server
EXPOSE 5173

# Príkaz na spustenie Vite dev servera
# --host je dôležité, aby bol server dostupný zvonka kontajnera
CMD ["npm", "run", "dev", "--", "--host"]
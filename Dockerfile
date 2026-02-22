# ---------- ETAPA 1: BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Compilar proyecto
RUN npm run build


# ---------- ETAPA 2: PRODUCCIÓN ----------
FROM node:20-alpine

WORKDIR /app

# Copiar solo dependencias necesarias
COPY package*.json ./
RUN npm install --omit=dev

# Copiar solo el build compilado
COPY --from=builder /app/dist ./dist

# Exponer puerto (tu proyecto usa 3550)
EXPOSE 3550

# Ejecutar aplicación
CMD ["node", "dist/main.js"]
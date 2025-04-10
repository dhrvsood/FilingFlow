# Stage 1: Build React app
FROM node:18-alpine as builder
 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine
 
# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
# Copy built React files to NGINX’s public folder
COPY --from=builder /app/build /usr/share/nginx/html
 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# FROM node:18-alpine

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD ["npm", "start"]
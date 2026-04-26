FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi

ARG VITE_PAYLOAD_URL
ENV VITE_PAYLOAD_URL=$VITE_PAYLOAD_URL

ARG VITE_PAYLOAD_API_PATH=/api
ENV VITE_PAYLOAD_API_PATH=$VITE_PAYLOAD_API_PATH

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

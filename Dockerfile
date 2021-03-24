FROM node:12.14.0 as builder

ARG GEOSERVER_ENDPOINT
ARG MD_SERVER_ENDPOINT
ARG CONFIG

WORKDIR '/app'

COPY ./package*.json ./

RUN npm install

COPY . .

ENV REACT_APP_GEOSERVER_ENDPOINT="${GEOSERVER_ENDPOINT}" \ 
    REACT_APP_MD_SERVER_ENDPOINT="${MD_SERVER_ENDPOINT}" \
    REACT_APP_APP_CONFIG="${CONFIG}" 


RUN npm run build

FROM nginx

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
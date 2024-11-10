FROM node:latest as builder

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM node:alpine

WORKDIR /app
RUN apk add --no-cache --update openssh-client
COPY --from=builder /app/.output .
COPY workflow/comfy.pem ./comfy.pem

ARG COMFY_PORT
ARG SSH_SERVER
ARG SSH_USER
ARG SSH_PORT
ENV COMFY_PORT=$COMFY_PORT
ENV SSH_SERVER=$SSH_SERVER
ENV SSH_USER=$SSH_USER
ENV SSH_PORT=$SSH_PORT

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh && \
    chmod 600 ./comfy.pem

ENTRYPOINT ["./entrypoint.sh"]

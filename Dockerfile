FROM node:15.11.0-alpine

ARG UID=1001
ARG GID=1001

RUN addgroup -S files -g $GID && adduser -D -S files -G files -u $UID

RUN apk add --update --no-cache \
    alpine-sdk \
    python \
    curl

WORKDIR /var/www

RUN chown -R $UID:$GID .

USER files

COPY --chown=$UID:$GID package.json yarn.lock /var/www/

RUN yarn install --pure-lockfile

COPY --chown=$UID:$GID . /var/www

RUN yarn build

ENTRYPOINT [ "docker/entrypoint.sh" ]

CMD [ "start-web" ]

FROM harbor.ant-lord.com/library/node:23.5-alpine as build

LABEL maintainer="高金斌 <xiaomucool@bingblue.com>"

WORKDIR /build

COPY . /build

RUN pnpm i
ARG BRANCH
RUN npm run ${BRANCH}

FROM harbor.ant-lord.com/library/nginx:latest

COPY .gitlab/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html

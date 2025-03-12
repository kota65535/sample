FROM debian:latest

WORKDIR /app

RUN apt update && apt install -y openssl tini

COPY dist/app .
COPY dist/libquery_engine-linux-arm64-openssl-3.0.x.so.node .
RUN chmod +x libquery_engine-linux-arm64-openssl-3.0.x.so.node
RUN chmod +x /app/app

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["./app"]

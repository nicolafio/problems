FROM debian:12-slim AS base

RUN apt update
RUN apt install -y build-essential

FROM base AS build

WORKDIR /work

COPY . .

# https://help.acmicpc.net/language/info
RUN g++ solution.cc -o ./solution -O2 -Wall -lm -static -std=gnu++17
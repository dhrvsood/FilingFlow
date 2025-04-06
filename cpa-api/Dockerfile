# Use an official OpenJDK runtime as the base image
FROM openjdk:17-jdk-slim AS build

WORKDIR /app

# Copy in files that rarely change first for layer caching
COPY pom.xml mvnw mvnw.cmd ./
COPY .mvn .mvn
RUN chmod +x mvnw

# Pre-fetch dependencies
RUN ./mvnw dependency:resolve

# Copy the rest of the source code
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests
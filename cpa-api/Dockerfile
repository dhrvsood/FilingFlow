# Build stage
FROM openjdk:17-jdk-slim AS build

WORKDIR /app

COPY pom.xml mvnw mvnw.cmd ./
COPY .mvn .mvn
COPY . .

# Grant execute permission after copy
RUN chmod +x mvnw

# Build application
RUN ./mvnw clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# # Copy .env into container
# COPY .env .env

# # Export env vars from .env
# RUN set -a && source .env && set +a

# Expose the application port
EXPOSE 8081

# Run application
CMD ["java", "-jar", "app.jar"]
# CMD ["sh", "-c", "set -a && source .env && java -jar app.jar"]
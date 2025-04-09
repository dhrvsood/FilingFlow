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

# Expose the application port
EXPOSE 8081

# Run application
CMD ["java", "-jar", "app.jar"]
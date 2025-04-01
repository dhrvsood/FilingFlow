# Use Maven for building the project
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /cpa-api

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the project using Maven
RUN mvn clean package -DskipTests

# Use the JDK 17 runtime to run the Spring Boot app
FROM openjdk:17-jdk-alpine
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /cpa-api/target/cpa-api-0.0.1-SNAPSHOT.jar /app/cpa-api.jar

# Run the application
ENTRYPOINT ["java", "-jar", "/app/cpa-api.jar"]

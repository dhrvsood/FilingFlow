# Use an official OpenJDK runtime as the base image
FROM openjdk:17-jdk-slim AS build

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY pom.xml mvnw mvnw.cmd ./
COPY .mvn .mvn

# Grant execute permission for the Maven wrapper
RUN chmod +x mvnw

# Resolve dependencies to speed up future builds
RUN ./mvnw dependency:resolve

# Copy the entire project source
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Use a minimal JDK runtime for running the application
FROM openjdk:17-jdk-slim

# Set the working directory for the runtime container
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/cpa-api-0.0.1-SNAPSHOT.jar /app/cpa-api.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/cpa-api.jar"]

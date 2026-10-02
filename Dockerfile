FROM maven:3.9-eclipse-temurin-25 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:25-jre-alpine
COPY --from=build /target/setup-0.0.1-SNAPSHOT.jar setup.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","setup.jar"]

# ──────────────────────────────────────────────
# Stage 1: Build stage (Maven + JDK)
# ──────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Download dependencies first (layer cache optimization)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build the application
COPY src ./src
RUN mvn package -DskipTests -B

# ──────────────────────────────────────────────
# Stage 2: Runtime stage (JRE only — minimal)
# ──────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup -S devnexa && adduser -S devnexa -G devnexa

# Copy built JAR
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory for file storage
RUN mkdir -p /app/uploads && chown devnexa:devnexa /app/uploads

USER devnexa

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

# JVM production flags: G1GC, memory limits, container awareness
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:+UseG1GC", \
  "-XX:+HeapDumpOnOutOfMemoryError", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]


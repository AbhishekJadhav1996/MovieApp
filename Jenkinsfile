pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node22'
    }

    environment {
        BACKEND_PORT = '5000'
        GATEWAY_PORT = '8000'
        FRONTEND_PORT = '3001'
    }

    stages {
        stage("Clean Workspace") {
            steps { cleanWs() }
        }

        stage("Git Checkout") {
            steps {
                git branch: 'main', url: 'https://github.com/AbhishekJadhav1996/MovieApp.git'
            }
        }

        stage("Install NPM Dependencies") {
            steps {
                parallel(
                    "API Gateway": { dir("api-gateway") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } },
                    "Backend": { dir("movie-app-backend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } },
                    "Frontend": { dir("movie-app-frontend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } }
                )
            }
        }

        stage("Generate .env") {
            steps {
                script {
                    withCredentials([string(credentialsId: 'mongo-uri', variable: 'MONGO_URI')]) {
                        sh """
PUBLIC_IP=\$(curl -s http://checkip.amazonaws.com)

cat > .env <<EOF
BACKEND_PORT=${BACKEND_PORT}
GATEWAY_PORT=${GATEWAY_PORT}
FRONTEND_PORT=${FRONTEND_PORT}

MONGO_URI=${MONGO_URI}

# Frontend env consumed by React (browser must reach gateway via public IP)
REACT_APP_API_BASE_URL=http://\$PUBLIC_IP:${GATEWAY_PORT}
REACT_APP_WS_URL=ws://\$PUBLIC_IP:${BACKEND_PORT}/ws

# Gateway internal upstream to backend inside the Docker network
MOVIE_SERVICE_URL=http://backend:${BACKEND_PORT}
EOF
"""
                    }
                }
            }
        }

        stage("Docker Compose Build & Deploy") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PWD')]) {
                        sh """
echo "\$DOCKER_PWD" | docker login -u "\$DOCKER_USER" --password-stdin
docker compose --env-file .env up --build -d
docker compose logs --tail=50
docker ps --filter "name=movie"
"""
                    }
                }
            }
        }

        stage("Health Checks") {
            steps {
                script {
                    sh """
PUBLIC_IP=\$(curl -s http://checkip.amazonaws.com)
echo "Probing services on \$PUBLIC_IP"
set -e
for i in 1 2 3 4 5; do
  (curl -sf http://\$PUBLIC_IP:${BACKEND_PORT}/health && echo "backend OK") && break || (echo "waiting backend" && sleep 5)
done
for i in 1 2 3 4 5; do
  (curl -sf http://\$PUBLIC_IP:${GATEWAY_PORT}/health && echo "gateway OK") && break || (echo "waiting gateway" && sleep 5)
done
for i in 1 2 3 4 5; do
  (curl -sf http://\$PUBLIC_IP:${FRONTEND_PORT} && echo "frontend OK") && break || (echo "waiting frontend" && sleep 5)
done
"""
                }
            }
        }

        stage("Push Docker Images") {
            steps {
                script {
                    sh '''
docker push abhishekjadhav1996/movie-backend:latest
docker push abhishekjadhav1996/movie-gateway:latest
docker push abhishekjadhav1996/movie-frontend:latest
'''
                }
            }
        }

    } // <-- closes stages block

    post {
        always { echo "Pipeline finished. Containers left running for inspection." }
        success { echo "✅ Build, deploy, and health checks succeeded!" }
        failure { echo "❌ Pipeline failed. Check logs for details." }
    }
}


// pipeline {
//     agent any

//     tools {
//         jdk 'jdk17'
//         nodejs 'node22'
//     }

//     environment {
//         BACKEND_PORT = '5000'
//         GATEWAY_PORT = '8000'
//         FRONTEND_PORT = '3001'
//     }

//     stages {
//         stage("Clean Workspace") {
//             steps { cleanWs() }
//         }

//         stage("Git Checkout") {
//             steps {
//                 git branch: 'main', url: 'https://github.com/AbhishekJadhav1996/MovieApp.git'
//             }
//         }

//         stage("Install NPM Dependencies") {
//             steps {
//                 parallel(
//                     "API Gateway": { dir("api-gateway") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } },
//                     "Backend": { dir("movie-app-backend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } },
//                     "Frontend": { dir("movie-app-frontend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } }
//                 )
//             }
//         }

//         stage("Generate .env") {
//             steps {
//                 script {
//                     withCredentials([string(credentialsId: 'mongo-uri', variable: 'MONGO_URI')]) {
//                         sh """
// PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)

// cat > .env <<EOF
// BACKEND_PORT=${BACKEND_PORT}
// GATEWAY_PORT=${GATEWAY_PORT}
// FRONTEND_PORT=${FRONTEND_PORT}

// MONGO_URI=${MONGO_URI}

// # Frontend env consumed by React (browser must reach gateway via public IP)
// REACT_APP_API_BASE_URL=http://$PUBLIC_IP:${GATEWAY_PORT}
// REACT_APP_WS_URL=ws://$PUBLIC_IP:${BACKEND_PORT}/ws

// # Gateway internal upstream to backend inside the Docker network
// MOVIE_SERVICE_URL=http://backend:${BACKEND_PORT}
// EOF
// """
//                     }
//                 }
//             }
//         }

//         stage("Docker Compose Build & Deploy") {
//             steps {
//                 script {
//                     withCredentials([usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PWD')]) {
//                         sh """
// echo "\$DOCKER_PWD" | docker login -u "\$DOCKER_USER" --password-stdin
// docker compose --env-file .env up --build -d
// docker compose logs --tail=50
// docker ps --filter "name=movie"
// """
//                     }
//                 }
//             }
//         }

//         stage("Health Checks") {
//             steps {
//                 script {
//                     sh """
// PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
// echo "Probing services on $PUBLIC_IP"
// set -e
// for i in 1 2 3 4 5; do
//   (curl -sf http://$PUBLIC_IP:${BACKEND_PORT}/health && echo "backend OK") && break || (echo "waiting backend" && sleep 5)
// done
// for i in 1 2 3 4 5; do
//   (curl -sf http://$PUBLIC_IP:${GATEWAY_PORT}/health && echo "gateway OK") && break || (echo "waiting gateway" && sleep 5)
// done
// for i in 1 2 3 4 5; do
//   (curl -sf http://$PUBLIC_IP:${FRONTEND_PORT} && echo "frontend OK") && break || (echo "waiting frontend" && sleep 5)
// done
// """
//                 }
//             }
//         }

//         stage("Push Docker Images") {
//             steps {
//                 script {
//                     sh '''
// docker push abhishekjadhav1996/movie-backend:latest
// docker push abhishekjadhav1996/movie-gateway:latest
// docker push abhishekjadhav1996/movie-frontend:latest
// '''
//                 }
//             }
//         }

//     } // <-- make sure this closes the stages block

//     post {
//         always { echo "Pipeline finished. Containers left running for inspection." }
//         success { echo "✅ Build, deploy, and health checks succeeded!" }
//         failure { echo "❌ Pipeline failed. Check logs for details." }
//     }
// }


// pipeline {
//     agent any

//     tools {
//         jdk 'jdk17'
//         nodejs 'node22'
//     }

//     environment {
//         SCANNER_HOME = tool 'sonar-scanner'
//         BACKEND_PORT = '5000'
//         GATEWAY_PORT = '8000'
//         FRONTEND_PORT = '3001'
//     }

//     stages {
//         stage("Clean Workspace") {
//             steps { cleanWs() }
//         }

//         stage("Git Checkout") {
//             steps {
//                 git branch: 'main', url: 'https://github.com/AbhishekJadhav1996/MovieApp.git'
//             }
//         }

//         stage("SonarQube Analysis") {
//             steps {
//                 withSonarQubeEnv('sonar-server') {
//                     sh '''
//                         $SCANNER_HOME/bin/sonar-scanner \
//                         -Dsonar.projectName=movie \
//                         -Dsonar.projectKey=movie \
//                         -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/** \
//                         -Dsonar.javascript.node.maxspace=4096
//                     '''
//                 }
//             }
//         }

//         stage("Quality Gate") {
//             steps {
//                 script {
//                     timeout(time: 10, unit: 'MINUTES') {
//                         def qg = waitForQualityGate abortPipeline: true, credentialsId: 'sonar-token'
//                         echo "Quality Gate status: ${qg.status}"
//                     }
//                 }
//             }
//         }

//         stage("Install NPM Dependencies") {
//             steps {
//                 parallel(
//                     "API Gateway": { dir("api-gateway") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } },
//                     "Backend": { dir("movie-app-backend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } },
//                     "Frontend": { dir("movie-app-frontend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } }
//                 )
//             }
//         }

//         stage("Trivy File Scan") {
//             steps {
//                 dir("api-gateway") { sh "trivy fs . > trivy-api-gateway.txt" }
//                 dir("movie-app-backend-master") { sh "trivy fs . > trivy-backend.txt" }
//                 dir("movie-app-frontend-master") { sh "trivy fs . > trivy-frontend.txt" }
//             }
//         }

//         stage("Generate .env") {
//             steps {
//                 script {
//                     withCredentials([string(credentialsId: 'mongo-uri', variable: 'MONGO_URI')]) {
//                         sh """
//                         cat > .env <<EOF
// BACKEND_PORT=${BACKEND_PORT}
// GATEWAY_PORT=${GATEWAY_PORT}
// FRONTEND_PORT=${FRONTEND_PORT}
// MONGO_URI=${MONGO_URI}

// # React frontend environment
// REACT_APP_API_URL=http://localhost:${GATEWAY_PORT}
// REACT_APP_WS_URL=ws://localhost:${BACKEND_PORT}/ws
// EOF
//                         """
//                     }
//                 }
//             }
//         }

//         stage("Docker Compose Build & Deploy") {
//             steps {
//                 script {
//                     withCredentials([usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PWD')]) {
//                         sh """
//                         echo "\$DOCKER_PWD" | docker login -u "\$DOCKER_USER" --password-stdin
//                         docker compose --env-file .env up --build -d
//                         docker compose logs --tail=50
//                         docker ps --filter "name=movie"
//                         """
//                     }
//                 }
//             }
//         }

//         stage("Push Images to DockerHub") {
//             steps {
//                 script {
//                     sh '''
//                         docker push abhishekjadhav1996/movie-backend:latest
//                         docker push abhishekjadhav1996/movie-gateway:latest
//                         docker push abhishekjadhav1996/movie-frontend:latest
//                     '''
//                 }
//             }
//         }

//         stage("Trivy Scan Docker Images") {
//             steps {
//                 script {
//                     def images = [
//                         "abhishekjadhav1996/movie-backend:latest",
//                         "abhishekjadhav1996/movie-gateway:latest",
//                         "abhishekjadhav1996/movie-frontend:latest"
//                     ]
//                     for (img in images) {
//                         sh """
//                             echo "🔍 Scanning image: ${img}"
//                             trivy image -f json -o trivy-${img.replaceAll("[/:]", "_")}.json ${img}
//                             trivy image -f table -o trivy-${img.replaceAll("[/:]", "_")}.txt ${img}
//                         """
//                     }
//                 }
//             }
//         }

//         stage("Health Checks") {
//             steps {
//                 script {
//                     def services = [
//                         ["backend", BACKEND_PORT],
//                         ["gateway", GATEWAY_PORT],
//                         ["frontend", FRONTEND_PORT]
//                     ]
//                     for (svc in services) {
//                         sh """
//                             for i in {1..10}; do
//                                 if curl -s http://localhost:${svc[1]} > /dev/null; then
//                                     echo "✅ ${svc[0]} is UP!"
//                                     break
//                                 fi
//                                 echo "⏳ Waiting for ${svc[0]}... (\$i/10)"
//                                 sleep 5
//                             done
//                         """
//                     }
//                 }
//             }
//         }
//     }

//     post {
//         always { echo "Pipeline finished. Containers left running for inspection." }
//         success { echo "✅ Build, scan, deploy, and health checks succeeded!" }
//         failure { echo "❌ Pipeline failed. Check logs for details." }
//     }
// }


// pipeline {
//     agent any

//     tools {
//         jdk 'jdk17'
//         nodejs 'node22'
//     }

//     environment {
//         SCANNER_HOME = tool 'sonar-scanner'
//         BACKEND_PORT = '5000'
//         GATEWAY_PORT = '8000'
//         FRONTEND_PORT = '3001'
//     }

//     stages {
//         stage("Clean Workspace") {
//             steps { cleanWs() }
//         }

//         stage("Git Checkout") {
//             steps {
//                 git branch: 'main', url: 'https://github.com/AbhishekJadhav1996/MovieApp.git'
//             }
//         }

//         stage("SonarQube Analysis") {
//             steps {
//                 withSonarQubeEnv('sonar-server') {
//                     sh '''
//                         $SCANNER_HOME/bin/sonar-scanner \
//                           -Dsonar.projectName=movie \
//                           -Dsonar.projectKey=movie \
//                           -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/** \
//                           -Dsonar.javascript.node.maxspace=4096
//                     '''
//                 }
//             }
//         }

//         stage("Quality Gate") {
//             steps {
//                 script {
//                     timeout(time: 10, unit: 'MINUTES') {
//                         def qg = waitForQualityGate abortPipeline: true, credentialsId: 'sonar-token'
//                         echo "Quality Gate status: ${qg.status}"
//                     }
//                 }
//             }
//         }

//         stage("Install NPM Dependencies") {
//             steps {
//                 parallel(
//                     "API Gateway": { dir("api-gateway") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } },
//                     "Backend": { dir("movie-app-backend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } },
//                     "Frontend": { dir("movie-app-frontend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" } }
//                 )
//             }
//         }

//         stage("Trivy File Scan") {
//             steps {
//                 dir("api-gateway") { sh "trivy fs . > trivy-api-gateway.txt" }
//                 dir("movie-app-backend-master") { sh "trivy fs . > trivy-backend.txt" }
//                 dir("movie-app-frontend-master") { sh "trivy fs . > trivy-frontend.txt" }
//             }
//         }

//         stage("Docker Compose Build & Deploy") {
//             steps {
//                 script {
//                     withCredentials([
//                         usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PWD'),
//                         string(credentialsId: 'mongo-uri', variable: 'MONGO_URI')  // full hosted Mongo URI
//                     ]) {
//                         sh """#!/bin/bash
//                         set -e

//                         echo "🔹 Logging in to DockerHub..."
//                         echo "\$DOCKER_PWD" | docker login -u "\$DOCKER_USER" --password-stdin

//                         echo "🔹 Creating .env file..."
//                         cat > .env <<EOF
// BACKEND_PORT=${BACKEND_PORT}
// GATEWAY_PORT=${GATEWAY_PORT}
// FRONTEND_PORT=${FRONTEND_PORT}
// MONGO_URI=${MONGO_URI}
// MONGO_PORT=${MONGO_PORT}
// EOF

//                         echo "🔹 Running Docker Compose..."
//                         if command -v docker compose >/dev/null 2>&1; then
//                             docker compose -f docker-compose.yml up --build -d
//                             docker compose logs --tail=50
//                         else
//                             docker-compose -f docker-compose.yml up --build -d
//                             docker-compose logs --tail=50
//                         fi

//                         echo "🔹 Current containers:"
//                         docker ps --filter "name=movie"
//                         """
//                     }
//                 }
//             }
//         }

//         stage("Push Images to DockerHub") {
//             steps {
//                 script {
//                     sh '''
//                         docker push abhishekjadhav1996/movie-backend:latest
//                         docker push abhishekjadhav1996/movie-gateway:latest
//                         docker push abhishekjadhav1996/movie-frontend:latest
//                     '''
//                 }
//             }
//         }

//         stage("Trivy Scan Docker Images") {
//             steps {
//                 script {
//                     def images = [
//                         "abhishekjadhav1996/movie-backend:latest",
//                         "abhishekjadhav1996/movie-gateway:latest",
//                         "abhishekjadhav1996/movie-frontend:latest"
//                     ]
//                     for (img in images) {
//                         sh """
//                             echo "🔍 Scanning image: ${img}"
//                             trivy image -f json -o trivy-${img.replaceAll("[/:]", "_")}.json ${img}
//                             trivy image -f table -o trivy-${img.replaceAll("[/:]", "_")}.txt ${img}
//                         """
//                     }
//                 }
//             }
//         }

//         stage("Health Checks") {
//             steps {
//                 script {
//                     def services = [
//                         ["backend", BACKEND_PORT],
//                         ["gateway", GATEWAY_PORT],
//                         ["frontend", FRONTEND_PORT]
//                     ]
//                     for (svc in services) {
//                         sh """
//                             for i in {1..10}; do
//                                 if curl -s http://localhost:${svc[1]} > /dev/null; then
//                                     echo "✅ ${svc[0]} is UP!"
//                                     break
//                                 fi
//                                 echo "⏳ Waiting for ${svc[0]}... (\$i/10)"
//                                 sleep 5
//                             done
//                         """
//                     }
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             echo "Pipeline finished. Workspace cleanup skipped to keep containers running."
//             cleanWs()
//         }
//         success { echo "✅ Build, scan, deploy, and health checks succeeded!" }
//         failure { echo "❌ Pipeline failed. Check logs for details." }
//     }

// }


// pipeline {
//     agent any

//     tools {
//         jdk 'jdk17'
//         nodejs 'node22'
//     }

//     environment {
//         SCANNER_HOME = tool 'sonar-scanner'
//         BACKEND_PORT = '5000'
//         GATEWAY_PORT = '8000'
//         FRONTEND_PORT = '3000'
//     }

//     stages {
//         stage("Clean Workspace") {
//             steps { cleanWs() }
//         }

//         stage("Git Checkout") {
//             steps {
//                 git branch: 'main', url: 'https://github.com/AbhishekJadhav1996/MovieApp.git'
//             }
//         }

//         stage("SonarQube Analysis") {
//             steps {
//                 withSonarQubeEnv('sonar-server') {
//                     sh '''
//                         $SCANNER_HOME/bin/sonar-scanner \
//                           -Dsonar.projectName=movie \
//                           -Dsonar.projectKey=movie \
//                           -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/** \
//                           -Dsonar.javascript.node.maxspace=4096
//                     '''
//                 }
//             }
//         }

//         stage("Quality Gate") {
//             steps {
//                 script {
//                     timeout(time: 10, unit: 'MINUTES') {
//                         def qg = waitForQualityGate abortPipeline: true, credentialsId: 'sonar-token'
//                         echo "Quality Gate status: ${qg.status}"
//                     }
//                 }
//             }
//         }

//         stage("Install NPM Dependencies") {
//             steps {
//                 parallel(
//                     "API Gateway": {
//                         dir("api-gateway") {
//                             sh "npm install --legacy-peer-deps --no-audit --no-fund"
//                         }
//                     },
//                     "Backend": {
//                         dir("movie-app-backend-master") {
//                             sh "npm install --legacy-peer-deps --no-audit --no-fund"
//                         }
//                     },
//                     "Frontend": {
//                         dir("movie-app-frontend-master") {
//                             sh "npm install --legacy-peer-deps --no-audit --no-fund"
//                         }
//                     }
//                 )
//             }
//         }

//         stage("Trivy File Scan") {
//             steps {
//                 dir("api-gateway") { sh "trivy fs . > trivy-api-gateway.txt" }
//                 dir("movie-app-backend-master") { sh "trivy fs . > trivy-backend.txt" }
//                 dir("movie-app-frontend-master") { sh "trivy fs . > trivy-frontend.txt" }
//             }
//         }

//         stage("Docker Compose Build & Deploy") {
//             steps {
//                 script {
//                     withCredentials([
//                         usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PWD'),
//                         string(credentialsId: 'mongo-uri', variable: 'MONGO_URI'),
//                     ]) {
//                         sh """#!/bin/bash
//                         set -e
//                         echo "\$DOCKER_PWD" | docker login -u "\$DOCKER_USER" --password-stdin

//                         export BACKEND_PORT=\$BACKEND_PORT
//                         export GATEWAY_PORT=\$GATEWAY_PORT
//                         export FRONTEND_PORT=\$FRONTEND_PORT
//                         export MONGO_URI=\$MONGO_URI

//                         if command -v docker compose >/dev/null 2>&1; then
//                             docker compose -f docker-compose.yml up -d --build
//                         else
//                             docker-compose -f docker-compose.yml up -d --build
//                         fi
//                         """
//                     }
//                 }
//             }
//         }

//         stage("Push Images to DockerHub") {
//             steps {
//                 script {
//                     sh '''
//                         docker push abhishekjadhav1996/movie-backend:latest
//                         docker push abhishekjadhav1996/movie-gateway:latest
//                         docker push abhishekjadhav1996/movie-frontend:latest
//                     '''
//                 }
//             }
//         }

//         stage("Trivy Scan Docker Images") {
//             steps {
//                 script {
//                     def images = [
//                         "abhishekjadhav1996/movie-backend:latest",
//                         "abhishekjadhav1996/movie-gateway:latest",
//                         "abhishekjadhav1996/movie-frontend:latest"
//                     ]

//                     for (img in images) {
//                         sh """
//                             echo "🔍 Scanning image: ${img}"
//                             trivy image -f json -o trivy-${img.replaceAll("[/:]", "_")}.json ${img}
//                             trivy image -f table -o trivy-${img.replaceAll("[/:]", "_")}.txt ${img}
//                         """
//                     }
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             echo "Pipeline finished."
//             cleanWs()
//             // ✅ Removed container/image cleanup so containers keep running
//         }
//         success { echo "✅ Build, scan, and deployment succeeded!" }
//         failure { echo "❌ Pipeline failed. Check logs and reports." }
//     }
// }

// pipeline {
//     agent any

//     tools {
//         jdk 'jdk17'
//         nodejs 'node22'
//     }

//     environment {
//         SCANNER_HOME = tool 'sonar-scanner'
//         BACKEND_PORT = '5000'
//         GATEWAY_PORT = '8000'
//         FRONTEND_PORT = '3000'
//     }

//     stages {
//         stage("With Credentials") {
//             steps {
//                 withCredentials([
//                     string(credentialsId: 'PORT', variable: 'mongo'),
//                     string(credentialsId: 'sonar-token', variable: 'sonar'),
//                     string(credentialsId: 'mongo-uri', variable: 'mongo_url'),
//                     usernameColonPassword(credentialsId: 'docker', variable: 'docker')
//                 ]) {
//                     script {
//                         // ------------------ Pipeline Starts ------------------

//                         cleanWs()

//                         stage("Git Checkout") {
//                             git branch: 'main', url: 'https://github.com/AbhishekJadhav1996/MovieApp.git'
//                         }

//                         stage("SonarQube Analysis") {
//                             withSonarQubeEnv('sonar-server') {
//                                 sh '''
//                                     $SCANNER_HOME/bin/sonar-scanner \
//                                       -Dsonar.projectName=movie \
//                                       -Dsonar.projectKey=movie \
//                                       -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/** \
//                                       -Dsonar.javascript.node.maxspace=4096
//                                 '''
//                             }
//                         }

//                         stage("Quality Gate") {
//                             timeout(time: 10, unit: 'MINUTES') {
//                                 def qg = waitForQualityGate abortPipeline: true, credentialsId: "${sonar}"
//                                 echo "Quality Gate status: ${qg.status}"
//                             }
//                         }

//                         stage("Install NPM Dependencies") {
//                             parallel(
//                                 "API Gateway": {
//                                     dir("api-gateway") { sh "npm install --legacy-peer-deps --no-audit --no-fund" }
//                                 },
//                                 "Backend": {
//                                     dir("movie-app-backend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" }
//                                 },
//                                 "Frontend": {
//                                     dir("movie-app-frontend-master") { sh "npm install --legacy-peer-deps --no-audit --no-fund" }
//                                 }
//                             )
//                         }

//                         stage("Trivy File Scan") {
//                             dir("api-gateway") { sh "trivy fs . > trivy-api-gateway.txt" }
//                             dir("movie-app-backend-master") { sh "trivy fs . > trivy-backend.txt" }
//                             dir("movie-app-frontend-master") { sh "trivy fs . > trivy-frontend.txt" }
//                         }

//                         stage("Docker Compose Build & Deploy") {
//                             sh '''
//                                 DOCKER_USER=$(echo $docker | cut -d: -f1)
//                                 DOCKER_PWD=$(echo $docker | cut -d: -f2)

//                                 echo $DOCKER_PWD | docker login -u $DOCKER_USER --password-stdin

//                                 BACKEND_PORT=${BACKEND_PORT} \
//                                 GATEWAY_PORT=${GATEWAY_PORT} \
//                                 FRONTEND_PORT=${FRONTEND_PORT} \
//                                 MONGO_URI=${mongo_url} \
//                                 (docker compose -f docker-compose.yml up -d --build || docker-compose -f docker-compose.yml up -d --build)
//                             '''
//                         }

//                         stage("Trivy Scan Docker Images") {
//                             sh '''
//                                 echo "🔍 Running Trivy scan on all images"

//                                 trivy image -f json -o trivy-backend.json movie-backend
//                                 trivy image -f table -o trivy-backend.txt movie-backend

//                                 trivy image -f json -o trivy-gateway.json movie-gateway
//                                 trivy image -f table -o trivy-gateway.txt movie-gateway

//                                 trivy image -f json -o trivy-frontend.json movie-frontend
//                                 trivy image -f table -o trivy-frontend.txt movie-frontend
//                             '''
//                         }

//                         // ------------------ Pipeline Ends ------------------
//                     }
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             echo "Pipeline finished. Cleaning up..."
//             cleanWs()
//             sh '''
//                 echo "🧹 Cleaning up Docker containers, images, and credentials..."
//                 docker ps -a --filter "name=movie" -q | xargs -r docker rm -f
//                 docker image prune -f
//                 docker volume prune -f
//                 docker logout || true
//             '''
//         }
//         success { echo "✅ Build, scan, and deployment succeeded!" }
//         failure { echo "❌ Pipeline failed. Check logs and reports." }
//     }
// }

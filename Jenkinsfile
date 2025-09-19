pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node22'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        BACKEND_PORT = '5000'
        GATEWAY_PORT = '8000'
        FRONTEND_PORT = '3000'
    }

    stages {
        stage("Clean Workspace") {
            steps {
                cleanWs()
            }
        }

        stage("Git Checkout") {
            steps {
                git branch: 'main', url: 'https://github.com/AbhishekJadhav1996/MovieApp.git'
            }
        }

        stage("SonarQube Analysis") {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''
                        $SCANNER_HOME/bin/sonar-scanner \
                          -Dsonar.projectName=movie \
                          -Dsonar.projectKey=movie \
                          -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/** \
                          -Dsonar.javascript.node.maxspace=4096
                    '''
                }
            }
        }

        stage("Quality Gate") {
            steps {
                script {
                    timeout(time: 10, unit: 'MINUTES') {
                        def qg = waitForQualityGate abortPipeline: true, credentialsId: 'sonar-token'
                        echo "Quality Gate status: ${qg.status}"
                    }
                }
            }
        }

        stage("Install NPM Dependencies") {
            steps {
                parallel(
                    "API Gateway": {
                        dir("api-gateway") {
                            sh "npm install --legacy-peer-deps --no-audit --no-fund"
                        }
                    },
                    "Backend": {
                        dir("movie-app-backend-master") {
                            sh "npm install --legacy-peer-deps --no-audit --no-fund"
                        }
                    },
                    "Frontend": {
                        dir("movie-app-frontend-master") {
                            sh "npm install --legacy-peer-deps --no-audit --no-fund"
                        }
                    }
                )
            }
        }

        stage("Trivy File Scan") {
            steps {
                dir("api-gateway") {
                    sh "trivy fs . > trivy-api-gateway.txt"
                }
                dir("movie-app-backend-master") {
                    sh "trivy fs . > trivy-backend.txt"
                }
                dir("movie-app-frontend-master") {
                    sh "trivy fs . > trivy-frontend.txt"
                }
            }
        }

        stage("Docker Compose Build & Deploy") {
            steps {
                script {
                    withCredentials([
                        usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PWD'),
                        string(credentialsId: 'mongo-uri', variable: 'MONGO_URI'),
                    ]) {
                        // ✅ Safe login with Jenkins docker-cred
                        sh '''
                            echo $DOCKER_PWD | docker login -u $DOCKER_USER --password-stdin
                        '''

                        // ✅ Run docker compose (supports both v2 and v1)
                        sh '''
                            BACKEND_PORT=${BACKEND_PORT} \
                            GATEWAY_PORT=${GATEWAY_PORT} \
                            FRONTEND_PORT=${FRONTEND_PORT} \
                            MONGO_URI=${MONGO_URI} \
                            (docker compose -f docker-compose.yml up -d --build || docker-compose -f docker-compose.yml up -d --build)
                        '''
                    }
                }
            }
        }

        stage("Trivy Scan Docker Images") {
            steps {
                script {
                    sh '''
                        echo "🔍 Running Trivy scan on all images"

                        trivy image -f json -o trivy-backend.json movie-backend
                        trivy image -f table -o trivy-backend.txt movie-backend

                        trivy image -f json -o trivy-gateway.json movie-gateway
                        trivy image -f table -o trivy-gateway.txt movie-gateway

                        trivy image -f json -o trivy-frontend.json movie-frontend
                        trivy image -f table -o trivy-frontend.txt movie-frontend
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished. Cleaning up..."

            cleanWs()

            script {
                sh '''
                    echo "🧹 Cleaning up Docker containers, images, and credentials..."
                    
                    # Stop and remove containers related to movie app
                    docker ps -a --filter "name=movie" -q | xargs -r docker rm -f

                    # Remove dangling images
                    docker image prune -f

                    # Remove dangling volumes (optional)
                    docker volume prune -f

                    # Logout from DockerHub to avoid leaving credentials behind
                    docker logout || true
                '''
            }
        }
        success {
            echo "✅ Build, scan, and deployment succeeded!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs and reports."
        }
    }
}


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
//             steps {
//                 cleanWs()
//             }
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
//                 dir("api-gateway") {
//                     sh "trivy fs . > trivy-api-gateway.txt"
//                 }
//                 dir("movie-app-backend-master") {
//                     sh "trivy fs . > trivy-backend.txt"
//                 }
//                 dir("movie-app-frontend-master") {
//                     sh "trivy fs . > trivy-frontend.txt"
//                 }
//             }
//         }

//         stage("Docker Compose Build & Deploy") {
//             steps {
//                 script {
//                     withCredentials([
//                         string(credentialsId: 'docker-cred', variable: 'DOCKER_PWD'),
//                         string(credentialsId: 'mongo-uri', variable: 'MONGO_URI'),
//                     ]) {
//                         // Login to DockerHub
//                         sh "docker login -u abhishekjadhav1996 -p ${DOCKER_PWD}"

//                         // Run Docker Compose with environment variables from Jenkins credentials
//                         sh """
//                         BACKEND_PORT=${BACKEND_PORT} \
//                         GATEWAY_PORT=${GATEWAY_PORT} \
//                         FRONTEND_PORT=${FRONTEND_PORT} \
//                         MONGO_URI=${MONGO_URI} \
//                         docker-compose -f docker-compose.yml up -d --build
//                         """
//                     }
//                 }
//             }
//         }

//         stage("Trivy Scan Docker Images") {
//             steps {
//                 script {
//                     sh """
//                         echo '🔍 Running Trivy scan on all images'
//                         trivy image -f json -o trivy-image.json movie-backend
//                         trivy image -f table -o trivy-image.txt movie-backend

//                         trivy image -f json -o trivy-gateway.json movie-gateway
//                         trivy image -f table -o trivy-gateway.txt movie-gateway

//                         trivy image -f json -o trivy-frontend.json movie-frontend
//                         trivy image -f table -o trivy-frontend.txt movie-frontend
//                     """
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             echo "Pipeline finished. Cleaning up..."

//             // Clean Jenkins workspace
//             cleanWs()

//             // Clean up Docker resources
//             script {
//                 sh '''
//                     echo "🧹 Cleaning up Docker containers and images..."
//                     # Stop and remove all containers related to movie app
//                     docker ps -a --filter "name=movie" -q | xargs -r docker rm -f

//                     # Remove dangling images (untagged)
//                     docker image prune -f

//                     # Optional: Remove dangling volumes to save space
//                     docker volume prune -f
//                 '''
//             }
//         }
//         success {
//             echo "✅ Build, scan, and deployment succeeded!"
//         }
//         failure {
//             echo "❌ Pipeline failed. Check logs and reports."
//         }
//     }
// }



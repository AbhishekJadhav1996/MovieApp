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
                            sh "npm install"
                        }
                    },
                    "Backend": {
                        dir("movie-app-backend-master") {
                            sh "npm install"
                        }
                    },
                    "Frontend": {
                        dir("movie-app-frontend-master") {
                            sh "npm install"
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
                        string(credentialsId: 'docker-cred', variable: 'DOCKER_PWD'),
                        string(credentialsId: 'mongo-uri', variable: 'MONGO_URI'),
                        string(credentialsId: 'db-user', variable: 'DB_USER'),
                        string(credentialsId: 'db-password', variable: 'DB_PASSWORD')
                    ]) {
                        // Login to DockerHub
                        sh "docker login -u abhishekjadhav1996 -p ${DOCKER_PWD}"

                        // Run Docker Compose with environment variables from Jenkins credentials
                        sh """
                        BACKEND_PORT=${BACKEND_PORT} \
                        GATEWAY_PORT=${GATEWAY_PORT} \
                        FRONTEND_PORT=${FRONTEND_PORT} \
                        MONGO_URI=${MONGO_URI} \
                        docker-compose -f docker-compose.yml up -d --build
                        """
                    }
                }
            }
        }

        stage("Trivy Scan Docker Images") {
            steps {
                script {
                    sh """
                        echo '🔍 Running Trivy scan on all images'
                        trivy image -f json -o trivy-image.json movie-backend
                        trivy image -f table -o trivy-image.txt movie-backend

                        trivy image -f json -o trivy-gateway.json movie-gateway
                        trivy image -f table -o trivy-gateway.txt movie-gateway

                        trivy image -f json -o trivy-frontend.json movie-frontend
                        trivy image -f table -o trivy-frontend.txt movie-frontend
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished. Cleaning up..."
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
//         nodejs 'node18'
//     }

//     environment {
//         SCANNER_HOME = tool 'sonar-scanner'
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
//                             sh "npm install"
//                         }
//                     },
//                     "Backend": {
//                         dir("movie-app-backend-master") {
//                             sh "npm install"
//                         }
//                     },
//                     "Frontend": {
//                         dir("movie-app-frontend-master") {
//                             sh "npm install"
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


//     stage("Build Docker Image") {
//         steps {
//             script {
//                 env.IMAGE_TAG = "abhishekjadhav1996/movie:${BUILD_NUMBER}"
    
//                 // Cleanup old images if exist
//                 sh "docker rmi -f movie ${env.IMAGE_TAG} || true"
    
//                 // Build and tag with IMAGE_TAG
//                 sh "docker build -t ${env.IMAGE_TAG} -t movie ."
//             }
//         }
//     }

//         // stage("Build Docker Image") {
//         //     steps {
//         //         script {
//         //             env.IMAGE_TAG = "abhishekjadhav1996/movie:${BUILD_NUMBER}"

//         //             // Cleanup old images if exist
//         //             sh "docker rmi -f movie ${env.IMAGE_TAG} || true"

//         //             sh "docker build -t movie ."
//         //         }
//         //     }
//         // }

//         stage("Trivy Scan Image") {
//             steps {
//                 script {
//                     sh """
//                         echo '🔍 Running Trivy scan on ${env.IMAGE_TAG}'
        
//                         # JSON report
//                         trivy image -f json -o trivy-image.json ${env.IMAGE_TAG}
        
//                         # Table report
//                         trivy image -f table -o trivy-image.txt ${env.IMAGE_TAG}
//                     """
//                 }
//             }
//         }


//         stage("Tag & Push to DockerHub") {
//             steps {
//                 script {
//                     withCredentials([string(credentialsId: 'docker-cred', variable: 'dockerpwd')]) {
//                         sh "docker login -u abhishekjadhav1996 -p ${dockerpwd}"
//                         sh "docker tag movie ${env.IMAGE_TAG}"
//                         sh "docker push ${env.IMAGE_TAG}"

//                         // Push also as latest
//                         sh "docker tag movie abhishekjadhav1996/movie:latest"
//                         sh "docker push abhishekjadhav1996/movie:latest"
//                     }
//                 }
//             }
//         }

//         stage("Deploy to Container") {
//             steps {
//                 script {
//                     sh "docker rm -f movie || true"
//                     sh "docker run -d --name movie -p 80:80 ${env.IMAGE_TAG}"
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             echo "Pipeline finished. Cleaning up..."
//         }
//         success {
//             echo "✅ Build, scan, and deployment succeeded!"
//         }
//         failure {
//             echo "❌ Pipeline failed. Check logs and reports."
//         }
//     }
// }

pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    stages {
        stage('With Credentials') {
            steps {
                withCredentials([
                    string(credentialsId: 'PORT', variable: 'mongo'),
                    string(credentialsId: 'sonar-token', variable: 'sonar'),
                    string(credentialsId: 'mongo-uri', variable: 'mongo_url'),
                    usernamePassword(credentialsId: 'docker', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PWD')
                ]) {
                    script {
                        cleanWs()

                        stage('Git Checkout') {
                            git branch: 'main',
                                url: 'https://github.com/AbhishekJadhav1996/MovieApp.git'
                        }

                        stage('SonarQube Analysis') {
                            withSonarQubeEnv('sonar-server') {
                                sh '''
                                    sonar-scanner \
                                    -Dsonar.projectName=movie \
                                    -Dsonar.projectKey=movie \
                                    -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/** \
                                    -Dsonar.javascript.node.maxspace=4096
                                '''
                            }
                        }

                        stage('Quality Gate') {
                            timeout(time: 10, unit: 'MINUTES') {
                                def qg = waitForQualityGate()
                                echo "Quality Gate status: ${qg.status}"
                                if (qg.status != 'OK') {
                                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                                }
                            }
                        }

                        stage('Install NPM Dependencies') {
                            parallel {
                                stage('API Gateway') {
                                    steps {
                                        dir('api-gateway') {
                                            sh 'npm install --legacy-peer-deps --no-audit --no-fund'
                                        }
                                    }
                                }
                                stage('Backend') {
                                    steps {
                                        dir('movie-app-backend-master') {
                                            sh 'npm install --legacy-peer-deps --no-audit --no-fund'
                                        }
                                    }
                                }
                                stage('Frontend') {
                                    steps {
                                        dir('movie-app-frontend-master') {
                                            sh 'npm install --legacy-peer-deps --no-audit --no-fund'
                                        }
                                    }
                                }
                            }
                        }

                        stage('Trivy File Scan') {
                            parallel {
                                stage('API Gateway') {
                                    steps {
                                        dir('api-gateway') {
                                            sh 'trivy fs .'
                                        }
                                    }
                                }
                                stage('Backend') {
                                    steps {
                                        dir('movie-app-backend-master') {
                                            sh 'trivy fs .'
                                        }
                                    }
                                }
                                stage('Frontend') {
                                    steps {
                                        dir('movie-app-frontend-master') {
                                            sh 'trivy fs .'
                                        }
                                    }
                                }
                            }
                        }

                        stage('Docker Compose Build & Deploy') {
                            steps {
                                sh '''
                                    echo "$DOCKER_PWD" | docker login -u "$DOCKER_USER" --password-stdin
                                    docker compose up -d --build
                                '''
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished. Cleaning up..."
            cleanWs()
            sh '''
                echo "🧹 Cleaning up Docker containers, images, and credentials..."
                docker ps -a --filter "name=movie" -q | xargs -r docker rm -f
                docker image prune -f
                docker volume prune -f
                docker logout
            '''
        }
        failure {
            echo "❌ Pipeline failed. Check logs and reports."
        }
    }
}

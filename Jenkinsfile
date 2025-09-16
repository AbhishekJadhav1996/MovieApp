
pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node16'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
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
                    sh ''' $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=movie \
                        -Dsonar.projectKey=movie '''
                }
            }
        }

        stage("Quality Gate") {
            steps {
                script {
                    timeout(time: 3, unit: 'MINUTES') {
                  
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token'
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

       
        // stage("OWASP FS Scan") {
        //     steps {
        //         dependencyCheck additionalArguments: '''
        //             --scan ./ 
        //             --disableYarnAudit 
        //             --disableNodeAudit 
                
        //            ''',
        //         odcInstallation: 'dp-check'

        //         dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
        //     }
        // }


      stage("Trivy File Scan") {
    steps {
        parallel(
            "API Gateway Scan": {
                dir("api-gateway") {
                    sh "trivy fs . > trivy-api-gateway.txt"
                }
            },
            "Backend Scan": {
                dir("movie-app-backend-master") {
                    sh "trivy fs . > trivy-backend.txt"
                }
            },
            "Frontend Scan": {
                dir("movie-app-frontend-master") {
                    sh "trivy fs . > trivy-frontend.txt"
                }
            }
        )
    }
}


        stage("Build Docker Image") {
            steps {
                script {
                    env.IMAGE_TAG = "abhishekjadhav1996/movie:${BUILD_NUMBER}"

                    // Optional cleanup
                    sh "docker rmi -f movie ${env.IMAGE_TAG} || true"

                    sh "docker build -t movie ."
                }
            }
        }
        
        stage("Trivy Scan Image") {
            steps {
                script {
                    sh """
                    echo '🔍 Running Trivy scan on ${env.IMAGE_TAG}'

                    # JSON report
                    trivy image -f json -o trivy-image.json ${env.IMAGE_TAG}

                    # HTML report using built-in HTML format
                    trivy image -f table -o trivy-image.txt ${env.IMAGE_TAG}

                    # Fail build if HIGH/CRITICAL vulnerabilities found
                    # trivy image --exit-code 1 --severity HIGH,CRITICAL ${env.IMAGE_TAG} || true
                """
                }
            }
        }

        stage("Tag & Push to DockerHub") {
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker-cred', variable: 'dockerpwd')]) {
                        sh "docker login -u abhishekjadhav1996 -p ${dockerpwd}"
                        sh "docker tag movie ${env.IMAGE_TAG}"
                        sh "docker push ${env.IMAGE_TAG}"

                        // Also push latest
                        sh "docker tag movie abhishekjadhav1996/movie:latest"
                        sh "docker push abhishekjadhav1996/movie:latest"
                    }
                }
            }
        }

       



        stage("Deploy to Container") {
            steps {
                script {
                    sh "docker rm -f movie || true"
                    sh "docker run -d --name movie -p 80:80 ${env.IMAGE_TAG}"
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






pipeline {
    agent any

    environment {
        DOCKER_USERNAME = 'aadhityaiyer'
        IMAGE_NAME      = 'todo-app'
        IMAGE_TAG       = "build-${BUILD_NUMBER}"
        DOCKER_IMAGE    = "${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"
        // Your EC2 IP Address
        EC2_HOST = '34.224.93.63' 
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/aadhityaiyer/todo-app-aws.git'
            }
        }

        stage('2. Build & Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "docker build -t ${DOCKER_IMAGE} ."
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('3. Deploy to AWS EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {

                    // ---- THIS IS THE FIX ----
                    // We use '<< EOF' (no quotes) to allow Groovy to
                    // insert our variables like ${DOCKER_IMAGE}
                    sh """
                        ssh -o StrictHostKeyChecking=no ec2-user@${EC2_HOST} << EOF

                        echo "--- Logged in to EC2 ---"

                        echo "--- Pulling ${DOCKER_IMAGE} ---"
                        docker pull ${DOCKER_IMAGE}

                        echo "--- Stopping old container ---"
                        docker stop todo-web-app || true
                        docker rm todo-web-app || true

                        echo "--- Starting new container ---"
                        docker run -d -p 80:3000 \
                            --name todo-web-app \
                            ${DOCKER_IMAGE}

                        echo "--- Deployment to EC2 complete! ---"

EOF
                    """
                    // ---- END OF FIX ----
                }
            }
        }
    }

    post {
        always {
            sh "docker logout"
        }
    }
}

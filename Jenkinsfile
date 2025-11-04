pipeline {
    agent any

    environment {
        DOCKER_USERNAME = 'aadhityaiyer'
        // This is the Docker Hub repo name we created in Step 6
        IMAGE_NAME      = 'todo-app'
        IMAGE_TAG       = "build-${BUILD_NUMBER}"
        DOCKER_IMAGE    = "${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"

        // ⬇️ IMPORTANT: Paste your EC2 instance's Public IP here ⬇️
        EC2_HOST = '34.224.93.63' 
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                // This is the GitHub repo we created in Step 6
                git branch: 'main', url: 'https://github.com/aadhityaiyer/todo-app-aws.git'
            }
        }

        stage('2. Build & Push to Docker Hub') {
            steps {
                // This uses the 'dockerhub-creds' we have saved in Jenkins
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    // This command builds the image
                    sh "docker build -t ${DOCKER_IMAGE} ."

                    // This command logs in to Docker Hub
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"

                    // This command pushes the image
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('3. Deploy to AWS EC2') {
            steps {
                // This uses the 'ec2-ssh-key' credential we created in Step 3
                sshagent(['ec2-ssh-key']) {

                    // This block of 'sh' commands will run *remotely* on your AWS EC2 server
                    sh """
                        # -o StrictHostKeyChecking=no tells SSH not to worry about fingerprints
                        ssh -o StrictHostKeyChecking=no ec2-user@${EC2_HOST} '

                        echo "--- Logged in to EC2 ---"

                        # 1. Pull the new image from Docker Hub
                        echo "--- Pulling ${DOCKER_IMAGE} ---"
                        docker pull ${DOCKER_IMAGE}

                        # 2. Stop and remove the old container (if it exists)
                        # || true means "don't fail if the container isn't found"
                        echo "--- Stopping old container ---"
                        docker stop todo-web-app || true
                        docker rm todo-web-app || true

                        # 3. Run the new container
                        # -d runs it in detached (background) mode
                        # -p 80:3000 maps port 80 (HTTP) to the container's port 3000
                        # --name gives it a simple name
                        echo "--- Starting new container ---"
                        docker run -d -p 80:3000 \
                            --name todo-web-app \
                            ${DOCKER_IMAGE}

                        echo "--- Deployment to EC2 complete! ---"
                        '
                    """
                }
            }
        }
    }

    post {
        // This 'post' block always runs, even if the pipeline fails
        always {
            // This cleans up our login session
            sh "docker logout"
        }
    }
}

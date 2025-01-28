pipeline {
    agent any
    environment {
        DOCKER_IMAGE = '<dockerhub-username>/user-management-app'
        DOCKER_TAG = 'v1.0'
    }
    stages {
        stage('Clone Repository') {
            steps {
                git credentialsId: 'github-credentials', url: 'https://github.com/<username>/user-management-app.git'
            }
        }
        stage('Build and Test') {
            steps {
                sh 'mvn clean package'
            }
        }
        stage('Docker Build and Push') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    '''
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f deployment.yaml
                    kubectl rollout status deployment/user-management-app
                '''
            }
        }
    }
}

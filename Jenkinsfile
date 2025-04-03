pipeline {
    agent any

    environment {
        REACT_APP_VERSION = "1.0.$BUILD_ID"
        AWS_DEFAULT_REGION = "us-east-1"
        AWS_ECR_REPO = "530789571735.dkr.ecr.us-east-1.amazonaws.com"
        APP_NAME = "ds-cpa"
        AWS_ECS_TD = "ds-cpa-td"
        AWS_ECS_CLUSTER = "ds-cpa-cluster"
        AWS_ECS_SERVICE = "ds-cpa-svc"
        AWS_ALBTG = ""
    }

    stages {
        stage('Build Docker Image and Push to ECR') {
            agent {
                docker {
                    image 'aws-cli'
                    args "-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=''"
                    reuseNode true
                }
            }
            steps {
                // sh 'aws --version'
                withCredentials([usernamePassword(credentialsId: '1cd9797d-e322-422e-98f5-b0bb61863f1d', 
                                                passwordVariable: 'AWS_SECRET_ACCESS_KEY', 
                                                usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                    aws sts get-caller-identity
                    aws ecr describe-repositories
                    docker --version

                    aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ECR_REPO

                    echo "$REACT_APP_VERSION=1.0.$BUILD_ID" > .env

                    echo "Building frontend..."
                    docker build -t $AWS_ECR_REPO/$APP_NAME-frontend:$REACT_APP_VERSION -f Dockerfile .
                    docker push $AWS_ECR_REPO/$APP_NAME-frontend:$REACT_APP_VERSION

                    echo "Building backend..."
                    docker build -t $AWS_ECR_REPO/$APP_NAME-backend:$REACT_APP_VERSION -f cpa-api/Dockerfile cpa-api
                    docker push $AWS_ECR_REPO/$APP_NAME-backend:$REACT_APP_VERSION
                    '''
                }
            }
        }
        stage('Deploy to AWS') {
            agent {
                docker {
                    image 'aws-cli'
                    args '--entrypoint=""'
                    reuseNode true
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: '1cd9797d-e322-422e-98f5-b0bb61863f1d', 
                                passwordVariable: 'AWS_SECRET_ACCESS_KEY', 
                                usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                    aws --version
                    # swap values for task-definition
                    sed -i "s/$#APP_VERSION#/$REACT_APP_VERSION"

                    # send the task definition to AWS to ECS
                    
                    # update ecs cluster 
                    aws ecs update-service --cluster $AWS_ECS_CLUSTER --service --task-definition $AWS_ECS_TD:$LATEST_TD
                    '''
                }
            }
        }
    }
}
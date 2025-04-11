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
        stage('Build Frontend Image & Push to ECR') {
            agent {
                docker {
                    image 'aws-cli'
                    args "-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=''"
                    reuseNode true
                }
            }
            steps {
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
                    '''
                }
            }
        }
        stage('Build Backend Image & Push to ECR') {
            agent {
                docker {
                    image 'aws-cli'
                    args "-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=''"
                    reuseNode true
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: '1cd9797d-e322-422e-98f5-b0bb61863f1d', 
                                                passwordVariable: 'AWS_SECRET_ACCESS_KEY', 
                                                usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                    aws sts get-caller-identity
                    aws ecr describe-repositories
                    docker --version

                    aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ECR_REPO

                    echo "$REACT_APP_VERSION=1.0.$BUILD_ID" > .env
                    
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
                    image 'amazon/aws-cli'
                    reuseNode true
                }
            }
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: '1cd9797d-e322-422e-98f5-b0bb61863f1d',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY',
                        usernameVariable: 'AWS_ACCESS_KEY_ID'
                    ),
                    usernamePassword(
                        credentialsId: 'Aurora-RDS-Creds',
                        passwordVariable: 'DB_PASSWORD',
                        usernameVariable: 'DB_USERNAME'
                    ),
                    string(
                        credentialsId: 'Aurora-RDS-Host',
                        variable: 'DB_HOST'
                    )
                ]) {
                    sh '''
                    aws --version

                    echo "Injecting APP_VERSION..."
                    sed -i "s/#APP_VERSION#/$REACT_APP_VERSION/g" aws/task-definition.json

                    echo "Injecting Aurora RDS environment variables into task definition..."
                    jq '.containerDefinitions[] |=
                        if .name == "ds-cpa-backend" then
                            . + {
                                environment: [
                                    { "name": "DB_HOST", "value": "'$DB_HOST'" },
                                    { "name": "DB_USERNAME", "value": "'$DB_USERNAME'" },
                                    { "name": "DB_PASSWORD", "value": "'$DB_PASSWORD'" }
                                ]
                            }
                        else
                            .
                        end' aws/task-definition.json > aws/updated-task-definition.json

                    echo "Updated Task Definition:"
                    cat aws/updated-task-definition.json

                    echo "Registering Task Definition..."
                    LATEST_TD=$(aws ecs register-task-definition --cli-input-json file://aws/updated-task-definition.json | jq '.taskDefinition.revision')

                    echo "Updating ECS Service..."
                    aws ecs update-service --cluster $AWS_ECS_CLUSTER --service $AWS_ECS_SERVICE --task-definition $AWS_ECS_TD:$LATEST_TD
                    '''
                }
            }
        }
    }
}
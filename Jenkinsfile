pipeline {
    agent any

    environment {
        REACT_APP_VERSION = "1.0.$BUILD_ID"
        AWS_DEFAULT_REGION = "us-east-1"
        AWS_ECR_REPO = "530789571735.dkr.ecr.us-east-1.amazonaws.com"
        APP_NAME = "ds-cpa"
        AWS_ECS_TD = "ds-cpa-taskdefinition"
        AWS_ECS_CLUSTER = "ds-cpa-cluster"
        AWS_ECS_SERVICE = "ds-cpa-svc"
        AWS_ALBTG = ""
    }

    stages {
        stage('SonarQube Analysis') {
            environment {
                SONAR_SCANNER_HOME = tool 'Sonar' // GLOBAL TOOL CONFIG NAME
            }
            steps {
                withSonarQubeEnv('Sonar') {
                    sh '''
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projecKey=jenkinsscan \
                        -Dsonar.projectName="jenkinsscan" \
                        -Dsonar.projectVersion=1.0 \
                        -Dsonar.sources=.

                        echo "Code Scanning Completed. Check SonarQube Analysis..."
                    '''
                }
            }
        }
        stage('Build Docker Image and Push to ECR') {
            agent {
                docker {
                    image 'amazon/aws-cli'
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
                    aws ecr describe-repository
                    docker --version

                    aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin
                    $AWS_ECR_REPO

                    echo "$REACT_APP_VERSION=1.0.$BUILD_ID" > .env

                    docker build -t $AWS_ECR_REPO/$APP_NAME-frontend:$REACT_APP_VERSION .
                    docker push $AWS_ECR_REPO/$APP_NAME-frontend:$REACT_APP_VERSION

                    docker build -t $AWS_ECR_REPO/$APP_NAME-backend:$REACT_APP_VERSION -F 'FilingFlow/cpa-backend/Dockerfile' ds-cpa-backend
                    docker push $AWS_ECR_REPO/$APP_NAME-backend:$REACT_APP_VERSION
                    '''
                }
            }
        }
        stage('Docker Scout Scan') {
            agent {
                docker {
                    image 'aws-cli'
                    args "-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=''"
                    reuseNode true
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'Docker-Login', passwordVariable: 'DockerHub_Password', usernameVariable: 'DockerHub_Username')]) {
                    sh '''
                        mkdir -p docker-scout-logs

                        # Install Docker Scout
                        curl -FsSL https://raw.githubusercontent.com/docker/scout-cli/main/install.sh | sh -s -- -b /usr/local/bin

                        docker-scout version > docker-scout-logs/version.log

                        echo "Logging into Docker Hub..."
                        docker login -u "$DockerHub_Username" -p $DockerHub_Password"

                        echo "Running Docker Scout Quickview..."
                        docker-scout quickview "$AWS_ECR_REPO/$APP_NAME-frontend:$REACT_APP_VERSION" > docker-scout-logs/quickview.log

                        echo "Running Docker Scout CVEs..."
                        docker-scout cve "$AWS_ECR_REPO/$APP_NAME-frontend:$REACT_APP_VERSION" > docker-scout-logs/cves.log

                        echo "Docker Scout Scan Complete..."

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
    post {
        always {
            echo "Archiving Docker Scout Logs..."
            archiveArtifacts artifacts: 'docker-scout-log/*.log' fingerprint: true
        }
    }
}
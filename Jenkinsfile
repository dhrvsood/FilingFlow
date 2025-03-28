pipeline {
    agent any

    stages {
        stage('AWS CLI') {
            agent {
                docker {
                    image 'amazon/aws-cli'
                    args "--entrypoint=''"
                }
            }
            steps {
                // sh 'aws --version'
                withCredentials([usernamePassword(credentialsId: '1cd9797d-e322-422e-98f5-b0bb61863f1d', 
                                                passwordVariable: 'AWS_SECRET_ACCESS_KEY', 
                                                usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                    echo Listing AWS CLI Version...
                    aws --version
                    '''
                }
            }
        }
    }
}
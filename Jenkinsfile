pipeline {
    agent any  
    tools {nodejs "node"}
    stages {
        stage('Cloning Git') {
            steps {
                git url: 'https://github.com/BalipalliGayathri/NodeJenkinsdfile.git'
            }
        }
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm start'
            }
        }
    }

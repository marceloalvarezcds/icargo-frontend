#!groovy

node('linux-docker') {

    def REGISTRY_IMAGE_URL="registry.gitlab.com/cds.py/icargo/icargo-v1/icargo-frontend"; 
    def WEBHOOKS_URL="http://163.172.182.37:19986";

    stage('Preparation') {
        checkout scm;
    }

    stage('Pre-Build') {
        withCredentials([string(credentialsId: 'telegramToken' , variable: 'TOKEN')]) {
            withCredentials([string(credentialsId: 'telegramChatid' , variable: 'CHAT_ID')]) {
                sh "curl --location --request POST 'https://api.telegram.org/bot$TOKEN/sendMessage' --form text='Building $JOB_NAME' --form chat_id='$CHAT_ID'"
            }       
        }    
    }

    try {
        stage('Docker build') {
            def imageName = "${REGISTRY_IMAGE_URL}:${env.BRANCH_NAME}";
            if (env.BRANCH_NAME == 'develop') {
                imageName = "${REGISTRY_IMAGE_URL}:develop";
            }

            docker.withRegistry('https://registry.gitlab.com', 'dante_jenkins') {
                def customImage = docker.build(imageName)
                customImage.push();
            }
        }
        echo 'This will run only if successful'
        withCredentials([string(credentialsId: 'telegramToken' , variable: 'TOKEN')]) {
            withCredentials([string(credentialsId: 'telegramChatid' , variable: 'CHAT_ID')]) {
                sh "curl --location --request POST 'https://api.telegram.org/bot$TOKEN/sendMessage' --form text='$JOB_NAME docker build success' --form chat_id='$CHAT_ID'"
            }           
        }
    } catch (e) {
        echo 'This will run only if failed'
        withCredentials([string(credentialsId: 'telegramToken' , variable: 'TOKEN')]) {
            withCredentials([string(credentialsId: 'telegramChatid' , variable: 'CHAT_ID')]) {
                sh "curl --location --request POST 'https://api.telegram.org/bot$TOKEN/sendMessage' --form text='$JOB_NAME docker build failed' --form chat_id='$CHAT_ID'"
            }           
        }

        throw e
    } finally {
        echo 'Docker build finished'
    }

   stage('Aprovisioning') {
        if (env.BRANCH_NAME == 'develop') {
            sh "curl ${WEBHOOKS_URL}/hooks/redeploy-icargo-frontend-develop"
        }
    }

    stage('Final') {
        withCredentials([string(credentialsId: 'telegramToken' , variable: 'TOKEN')]) {
            withCredentials([string(credentialsId: 'telegramChatid' , variable: 'CHAT_ID')]) {
                sh "curl --location --request POST 'https://api.telegram.org/bot$TOKEN/sendMessage' --form text='$JOB_NAME finished' --form chat_id='$CHAT_ID'"
            }       
        }    
    }
}
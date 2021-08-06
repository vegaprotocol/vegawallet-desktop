/* properties of scmVars (example):
    - GIT_BRANCH:PR-40
    - GIT_COMMIT:05a1c6fbe7d1ff87cfc40a011a63db574edad7e6
    - GIT_PREVIOUS_COMMIT:5d02b46fdb653f789e799ff6ad304baccc32cbf9
    - GIT_PREVIOUS_SUCCESSFUL_COMMIT:5d02b46fdb653f789e799ff6ad304baccc32cbf9
    - GIT_URL:https://github.com/vegaprotocol/desktop-wallet.git
*/
def scmVars = null
def version = 'UNKNOWN'
def versionHash = 'UNKNOWN'

pipeline {
    agent { label 'general' }
    environment {
        CGO_ENABLED = 1
        GO111MODULE = 'on'
        SLACK_MESSAGE = "DesktopWallet CI » <${RUN_DISPLAY_URL}|Jenkins ${BRANCH_NAME} Job>${ env.CHANGE_URL ? " » <${CHANGE_URL}|GitHub PR #${CHANGE_ID}>" : '' }"
    }

    stages {
        stage('Git clone') {
            options { retry(3) }
            steps {
                sh 'printenv'
                echo "${params}"
                script {
                    scmVars = checkout(scm)
                    versionHash = sh (returnStdout: true, script: "echo \"${scmVars.GIT_COMMIT}\"|cut -b1-8").trim()
                    version = sh (returnStdout: true, script: "git describe --tags 2>/dev/null || echo ${versionHash}").trim()
                }
            }
        }

        stage('Download dependencies') {
            options { retry(3) }
            steps {
                sh 'go mod download -x'
                sh 'go get -v -t -d ./...'
            }
        }

        stage('Linux build') {
            options { retry(3) }
            steps {
                sh label: 'Build', script: '''
                    wails build
                '''
                // TODO: add some checks (--help or --version)
                sh label: 'Sanity check', script: '''
                    ls -lah
                '''
            }
        }

        stage('Tests') {
            parallel {
                stage('unit tests') {
                    options { retry(3) }
                    steps {
                        sh 'go test -v ./... 2>&1 | tee unit-test-results.txt && cat unit-test-results.txt | go-junit-report > unit-test-report.xml'
                        junit checksName: 'Unit Tests', testResults: 'unit-test-report.xml'
                    }
                }
                stage('unit tests with race') {
                    environment {
                        CGO_ENABLED = 1
                    }
                    options { retry(3) }
                    steps {
                        sh 'go test -v -race ./... 2>&1 | tee unit-test-race-results.txt && cat unit-test-race-results.txt | go-junit-report > unit-test-race-report.xml'
                        junit checksName: 'Unit Tests with Race', testResults: 'unit-test-race-report.xml'
                    }
                }
                stage('test frontend') {
                    options { retry(3) }
                    steps {
                        dir('frontend') {
                            sh 'npm test -- --watchAll=false --passWithNoTests'
                            // TODO add junit result file
                            sh 'ls -lah'
                        }
                    }
                }
            }
        }
    }
    post {
        success {
            retry(3) {
                slackSend(channel: "#tradingcore-notify", color: "good", message: ":white_check_mark: ${SLACK_MESSAGE} (${currentBuild.durationString.minus(' and counting')})")
            }
        }
        unsuccessful {
            retry(3) {
                slackSend(channel: "#tradingcore-notify", color: "danger", message: ":red_circle: *${currentBuild.result}* ${SLACK_MESSAGE} (${currentBuild.durationString.minus(' and counting')})")
            }
        }
    }
}

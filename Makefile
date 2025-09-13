# import config.
# You can change the default config with `make cnf="config_special.env" build`
cnf ?= .env
-include $(cnf)
export $(shell [ -f $(cnf) ] && sed 's/=.*//' $(cnf))

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
.DEFAULT_GOAL := help

LOCAL_PLATFORM_FLAG := $(shell [[ `uname -m` == "arm64" ]] && echo "--platform linux/amd64" || echo "" )



#------------------------------------------------------------------------------#

BUILD_DIR := $(PWD)/app
AWS_REGION := eu-central-1
image := node:20 # TODO any other image you want to use for building
lambda := $(MAKE_FUNCTION_NAME)
lambda_pattern := $(shell [[ -n "$(LAMBDA_PACKAGE_PATTERN)" ]] && echo "$(LAMBDA_PACKAGE_PATTERN)" || echo "." )
cmd := bash


exec: ## Exec docker with staging ENV
	docker run --rm -ti $(LOCAL_PLATFORM_FLAG) \
          -v ~/.aws:/root/.aws \
          -e AWS_PROFILE=${AWS_DEFAULT_PROFILE} \
          -e AWS_REGION=${AWS_REGION} \
          -v $(BUILD_DIR)/:/opt \
          -w=/opt \
          $(image) \
          $(cmd)


run-install: cmd=sh -c 'npm run install:dev'
run-install: exec ## Run install

run-lint: cmd=sh -c 'npm run lint'
run-lint: exec ## Run lint

run-lint-fix: cmd=sh -c 'npm run lint:fix'
run-lint-fix: exec ## Run lint-fix

run-checks: cmd=sh -c 'npm run checks'
run-checks: exec ## Run all checks

run-checks-fix: cmd=sh -c 'npm run checks:fix'
run-checks-fix: exec ## Run all checks with fix

run-test: cmd=sh -c 'npm run test'
run-test: exec ## Run test

run-build: cmd=sh -c 'npm run build'
run-build: exec ## Run build



deploy-stg: image=amazon/aws-cli # TODO any other image you want to use for deploying
deploy-stg: cmd=sh -c '\
	cd dist && zip -r lambda.zip $(lambda_pattern) && \
	aws lambda update-function-code --function-name $(lambda) --zip-file "fileb://lambda.zip"'
deploy-stg: exec ## Deploy staging

build-deploy-stg: ## Deploy staging
	$(MAKE) run-build
	$(MAKE) deploy-stg



update-env-stg: ## Update env vars on staging
	aws lambda update-function-configuration \
		--function-name $(lambda) \
	    --environment "Variables={$(shell cat .env | tr "\n" "," | sed 's/^,*//g' | sed 's/,*$$//g' )}" \
	  >/dev/null 2>&1

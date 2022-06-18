existing_stacks=aws cloudformation describe-stacks --stack-name $STACK_NAME | jq '.Stacks | length'
  
if [ $existing_stacks > 0 ]
then
    # create stack
    aws cloudformation create-stack --stack-name $STACK_NAME --template-body file://task-definition.${ENV_NAME}.yml
else
    # update stack
    echo "stack exists"
fi
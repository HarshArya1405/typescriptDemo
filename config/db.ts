import AWS from 'aws-sdk';

const AWS_ACCESS_KEY_ID : string = 'your-id-1'
const AWS_SECRET_ACCESS_KEY : string = 'your-key'

AWS.config.update({
    region:'us-east-1',
    accessKeyId:AWS_ACCESS_KEY_ID,
    secretAccessKey:AWS_SECRET_ACCESS_KEY
})

const db = new AWS.DynamoDB.DocumentClient()

const Tables = {  
    tasks: 'tasks',
    users: 'users'
};

export {
    db,
    Tables,
    AWS
}
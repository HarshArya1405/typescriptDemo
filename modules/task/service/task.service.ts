import { db,Tables,AWS } from "../../../config/db"
import { DocumentClient, GetItemInput, GetItemOutput } from 'aws-sdk/clients/dynamodb';
import { BaseUtil } from "../../../utils/BaseUtill";

export default class TaskService{
    private docClient: AWS.DynamoDB.DocumentClient;

    constructor() {
        this.docClient = new AWS.DynamoDB.DocumentClient();

    }

    async create(data:object):Promise<object>{
        const params:DocumentClient.PutItemInput = {
            TableName:Tables.tasks,
            Item : data
        }
        try {
            const result = await this.docClient.put(params).promise();
            console.log('tasks: save: success');
            return result;
        } catch (error) {
            console.error(`tasks: save: error - ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    }

    async get(id:number):Promise<object>{
        const params:DocumentClient.GetItemInput = {
            TableName:Tables.tasks,
            Key : {
                "id":id
            }
        }
        try {
            const result = await this.docClient.get(params).promise();
            console.log('tasks: get: success');
            return result;
        } catch (error) {
            console.error(`tasks: get: error - ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    }

    async list(queryData: {
        title?: string;
        description?: string;
        completed?: boolean;
        limit?: number;
        skip?: number;
    }): Promise<{ data: object[]; totalCount: number }> {
        const scanParams: DocumentClient.ScanInput = {
            TableName: Tables.tasks,
            ProjectionExpression: 'id, title, description, completed', // Include only the desired attributes
        };
        if(queryData.title || queryData.description || queryData.completed){

            // Initialize FilterExpression and ExpressionAttributeValues
            scanParams.FilterExpression = '';
            scanParams.ExpressionAttributeValues = {};
            
            // Build a FilterExpression based on queryData
            if (queryData.title) {
                scanParams.FilterExpression += 'title = :title';
                scanParams.ExpressionAttributeValues[':title'] = queryData.title;
            }
            if (queryData.description) {
                if (scanParams.FilterExpression) {
                    scanParams.FilterExpression += ' AND ';
                }
                scanParams.FilterExpression += 'description = :description';
                scanParams.ExpressionAttributeValues[':description'] = queryData.description;
            }
            if (queryData.completed !== undefined) {
                if (scanParams.FilterExpression) {
                    scanParams.FilterExpression += ' AND ';
                }
                scanParams.FilterExpression += 'completed = :completed';
                scanParams.ExpressionAttributeValues[':completed'] = queryData.completed;
            }
            
        }
        // Apply limit and skip
        if (queryData.limit !== undefined) {
            scanParams.Limit = queryData.limit;
        }
        if (queryData.skip !== undefined) {
            scanParams.ExclusiveStartKey = { id: queryData.skip };
        }
        
        try {
            const result = await this.docClient.scan(scanParams).promise();
    
            const response: { data: object[]; totalCount: number } = {
                data: result.Items as object[],
                totalCount: result.Count || 0,
            };
            console.log('tasks: get: success');
            return response;
        } catch (error) {
            console.error(`tasks: get: error - ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    }
        
}

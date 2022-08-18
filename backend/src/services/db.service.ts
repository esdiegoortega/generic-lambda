import * as AWS from 'aws-sdk';
import { Agent as httpsAgent } from 'https';
import { InternalServerError } from '../errors';
import { User } from '../model';
export class DbService {
  
  private docClient: AWS.DynamoDB.DocumentClient; 

  constructor(){
    this.docClient = new AWS.DynamoDB.DocumentClient({httpOptions: {
        connectTimeout: 5000,
        agent: new httpsAgent({ keepAlive: true }),
    }});
  }

  /** DYNAMODB - Save data **/
  async saveData(tableSchema:string, user: User) {

    const params =  {
      TableName: tableSchema,
      Item: user.getData()
    }
      
    console.log("DYNAMODB - Saving user data: " + JSON.stringify(params));

    await this.docClient.put(params).promise()
    .then(function(data) {
      console.log("DYNAMODB - Data saved correctly: " + data);
    })
    .catch(function(err) {
      console.log(`DYNAMODB - ERROR SAVE > : ${err}`);
      throw Error(`DYNAMODB - ERROR SAVE > : ${err}`);
    });
  }

  /** DYNAMODB - Delete data **/
  async deleteData(tableSchema:string, key: Object): Promise<any> {
    const  params = {
      TableName: tableSchema,
      Key: key
    };
   
    await this.docClient.delete(params).promise()
    .then(function(data) {
      console.log("DYNAMODB - Delete Item succeeded:", JSON.stringify(data, null, 2));
    })
    .catch(function(err) {
      throw Error(`DYNAMODB - ERROR DELETE > : ${err}`);
    });

  }

  /** DYNAMODB - Get data **/
  async getData(tableSchema:string, key: Object): Promise<any> {
    let ret = {
      error: true,
      item: {},
    }

    const  params = {
      TableName: tableSchema,
      Key: key
    };

    let user = {};
    await this.docClient.get(params).promise()
    .then(function(data) {
      user = data.Item ?  data.Item  : {};
    })
    .catch(function(err) {
      console.log(`DYNAMODB - ERROR GET > : ${err}`);
      throw new InternalServerError(`DYNAMODB - ERROR GET > : ${err}`);
    });

    ret.error = false;
    ret.item = user;

    return ret;
  }

    /** DYNAMODB - Get data **/
    async saveDeviceData(tableSchema:string, deviceData: Object, key: Object): Promise<any> {

      console.log('Device:', deviceData);
      
      let item = await this.getData(tableSchema, key);
      item.item.devices = [deviceData];

      console.log('Item Device:', item);
      
      const params =  {
        TableName: tableSchema,
        Item: item.item
      }
        
      console.log("DYNAMODB - Saving deviceData data: " + JSON.stringify(params));
  
      await this.docClient.put(params).promise()
      .then(function(data) {
        console.log("DYNAMODB - Data saved correctly: " + data);
      })
      .catch(function(err) {
        console.log(`DYNAMODB - ERROR SAVE > : ${err}`);
        throw new InternalServerError(`DYNAMODB - ERROR SAVE > : ${err}`);
      });
    }
}
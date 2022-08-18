import * as AWS from 'aws-sdk';
import { InternalServerError } from "../errors/InternalServerError";

class SecretsManagerUtil {
    
    private aws = {
        region:<string> process.env.REGION,
        accountId:<string> process.env.CLIENT_ID,
        secretManagerId:<string> process.env.SECRET_MANAGER_ID
    };

    private secretName: string;

    private secretsManagerClient:AWS.SecretsManager;

    constructor(){
      this.secretName = `arn:aws:secretsmanager:${this.aws.region}:${this.aws.accountId}:secret:${this.aws.secretManagerId}`;
      this.secretsManagerClient = new AWS.SecretsManager({ region: this.aws.region });
    }

    async getSecretValue() {
        let secret:string = '';
        try {
            const secretValue = await this.secretsManagerClient.getSecretValue({SecretId: this.secretName}).promise();
            
            if ('SecretString' in secretValue) {
              secret = secretValue.SecretString ? secretValue.SecretString : '';
            }

        } catch (err) {
            throw new InternalServerError(`Error, SecretsManagerUtil - getSecretValue > ${err}`);
        }

        return JSON.parse(secret);                      
    }

}

export default SecretsManagerUtil;


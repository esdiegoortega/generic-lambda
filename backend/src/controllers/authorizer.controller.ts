import { isEmpty } from 'class-validator';
import jwt from 'jsonwebtoken';
import { JwksClient, SigningKey } from 'jwks-rsa';
import CustomError from '../errors/CustomError';
import InternalServerError from '../errors/InternalServerError';
import UnauthorizedError from '../errors/BadRequestError';
import BaseController from './base.controller';
import  SecretsManagerUtil from '../utils/SecretsManagerUtil';

class AuthorizerController extends BaseController{

  constructor() {
    super();
  }

  /** Verify Token **/
  async verifyToken (token:string) {
    const response = { validToken: false, messsage:"Token no valido", result:{} };
    try{
      /** Input validations **/
      if (isEmpty(token)){
        throw new UnauthorizedError("Error de autenticacion. Por favor verifique los datos enviados.");
      }

      const secretUtil = new SecretsManagerUtil();
      const secretManager = await secretUtil.getSecretValue();
      
      const clientToken = token.replace("Bearer ", "");
      const tokenDecoded = jwt.decode(clientToken, { complete: true });
      
      const kid = (tokenDecoded as { [key: string]: any })['header']['kid'].toString();
      const alg = (tokenDecoded as { [key: string]: any })['header']['alg'].toString();
      const iss = secretManager.IDP_ISS;
      const aud = secretManager.IDP_AUD;
      const jwksUriEnv = secretManager.IDP_JWKS_URI;

      const client =  new JwksClient({
          jwksUri: jwksUriEnv
      });

      const signingKey: SigningKey = await client.getSigningKey(kid);

      const payload = await jwt.verify(clientToken, signingKey.getPublicKey(), {
          algorithms: [alg],
          audience: aud,
          issuer: iss
      });
   
      response.validToken = true; 
      response.messsage = "Token valido";
      response.result = payload;
      
      return response; 
    }
    catch(err:any){

      if (!(err instanceof CustomError)) {
        err = new InternalServerError(err);
      }
      console.log(err.getLogError());
      response.messsage = err.getMessage();
      
      return response;
    }

  }

  private generatePolicyIAM(principalId:string, effect:string, resource:string){
      // Required output:
      let authResponse = {principalId:'',policyDocument:{}};
      authResponse.principalId = principalId;
      if (effect && resource) {
          let policyDocument = {Version:'',Statement:[{}]};
          policyDocument.Version = '2012-10-17'; // default version
          policyDocument.Statement = [];
          let statementOne = {Action:'', Effect:'', Resource:''};
          statementOne.Action = 'execute-api:Invoke'; // default action
          statementOne.Effect = effect;
          statementOne.Resource = resource;
          policyDocument.Statement[0] = statementOne;
          authResponse.policyDocument = policyDocument;
      }

      console.log(`Policy IAM: ${JSON.stringify(authResponse)}`);

      return authResponse;
  }

  private generateResource(methodArn:string) {
    const tmp = methodArn.split(':');
    const apiGatewayArnTmp = tmp[5].split('/');

    const action = tmp[2];
    const region = tmp[3];
    const awsAccountId = tmp[4];
    
    const apiId = apiGatewayArnTmp[0];
    const stage = apiGatewayArnTmp[1];
    const httpVerb = '*';
    const resourceTmp = apiGatewayArnTmp[3];
    const childResources = '*';

    console.log(`awsAccountId: ${awsAccountId}, region: ${region}, restApiId: ${apiId}, stage: ${stage}, method: ${httpVerb}, resource: ${resourceTmp}`);

    const resource = `arn:aws:${action}:${region}:${awsAccountId}:${apiId}/${stage}/${httpVerb}/${resourceTmp}/${childResources}`; 
   
    return resource;
  }

  generateAllow(principalId:string, methodArn:string) {
    const resource = this.generateResource(methodArn);
    console.log(`Resource Allow: ${resource}`);
    return this.generatePolicyIAM(principalId, 'Allow', resource);
  }
       
  generateDeny(principalId:string, methodArn:string) {
    return this.generatePolicyIAM(principalId, 'Deny', methodArn);
  } 

}

export default AuthorizerController;
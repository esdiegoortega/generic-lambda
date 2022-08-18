import { Handler, Context, Callback } from 'aws-lambda';
import { AuthorizerController } from '../../src/controllers';
import { CustomError, BadRequestError } from '../../src/errors';

export const GenericAuthorizer: Handler = async (event, context:Context ,callback:Callback ) => {

  try{
    let token = event.authorizationToken;
    const authorizerController = new AuthorizerController(); 
    const verifyToken = await authorizerController.verifyToken(token);

    if(!verifyToken.validToken){
      throw new BadRequestError(`Error de autenticacion. Por favor verifique los datos enviados.`);  
    }

    callback(null, authorizerController.generateAllow('user', event.methodArn));
  }
  catch(err:any){
      if (!(err instanceof CustomError)) {
        err = new BadRequestError(`Error de autenticacion. Por favor verifique los datos enviados.`);
      }

      console.log(err.getLogError());
      callback("Unauthorized");
  }  
}
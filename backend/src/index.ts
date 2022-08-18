import { Handler } from 'aws-lambda';
import { GenericController } from './controllers';
import { CustomError, BadRequestError } from './errors';

export const genericFunction: Handler = async (event:any) => {
    try{
      const genericController = await GenericController.create();
      const retFinal = await genericController.getData();
      return retFinal;
    }
    catch(err:any){
        if (!(err instanceof CustomError)) {
          err = new BadRequestError(`Error al registrar el usuario. Por favor verifique los datos enviados.`);
        }
        console.log(err.getLogError());
        const bodyResp = JSON.stringify({message: err.getMessage(), result:{}});
        const response = {
                          statusCode: err.getErrorCode(),
                          body: bodyResp,
                        };
        return response;
    }  
  }

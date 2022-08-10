import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
	aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
	}
};

const lambdaFunction = process.argv[2];
console.log(lambdaFunction);

const uploadToAws = async (functionLambda:string, zipFile:Buffer) => {
	  console.log(`<< INIT: uploadToAws function ${functionLambda} >>`);
	  try{
          const lambda = new AWS.Lambda(config.aws);
	      const res = await lambda.updateFunctionCode({
	      	FunctionName: functionLambda,
	      	ZipFile: zipFile, 
	      }).promise();

	      console.log(res);
	  }
	  catch(error){
          console.log('Error uploadToAws: ',error);
          throw Error(`ERROR: ${error}`);
	  }
      console.log(`<< FINISH: uploadToAws function ${functionLambda}  >>`);
      return '';
}; 

const deployToAws = async () => {
    try{
    	console.log('<< INIT: read file zip >>'); 
    	const file = fs.readFileSync(__dirname+'/../dist.zip');
    	console.log('<< FINISH: read file zip >>'); 
	    
	    await uploadToAws(lambdaFunction, file);
    } 	
    catch(err){
        throw Error(`ERROR: ${err}`);
    }
	
};

deployToAws();
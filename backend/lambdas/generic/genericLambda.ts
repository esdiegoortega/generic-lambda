import { Handler} from 'aws-lambda';
import { GenericController } from '../../src/controllers/generic.controller';

export const genericFunction: Handler = async (event) => {
    const genericController = await GenericController.create();
    const ret = await genericController.getData();
    return ret;
}
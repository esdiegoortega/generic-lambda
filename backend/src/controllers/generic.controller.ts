import BaseController from './base.controller';
import DbService from '../services/db.service';
import GenericService from '../services/generic.service';

class GenericController extends BaseController{
  genericService: GenericService;
  db: DbService;

  static dynamoDBTable = "SmartHome_tuya";
  
  private constructor(genericService:GenericService) {
    super();
    this.genericService = genericService;
    this.db = new DbService();
  }

  static async create() {
    const genericService = await GenericService.create();
    const genericController = new GenericController(genericService);

    return genericController;
  } 

  async getData(){
    return {data: "Hello World"};
  }

  protected response (code:number, bodyResp:string) {
    const response = {
      statusCode: code,
      body: bodyResp,
    };

    return response;    
  }
}

export default GenericController;
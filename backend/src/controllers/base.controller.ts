
export default abstract class BaseController {
  protected response (code:number, bodyResp:string) {
    const response = {
      statusCode: code,
      body: bodyResp,
    };

    return response;    
  }
}
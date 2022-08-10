import axios, { AxiosInstance } from "axios";

class GenericService{

    private config = {
        host:<string> '',
      };
    
      private httpClient: AxiosInstance; 

      private constructor(){
        this.config.host = process.env.host || 'https://rickandmortyapi.com/api';
    
        this.httpClient = axios.create({
          baseURL: this.config.host,
          timeout: 5 * 1e3,
        });  
      }

      static async create() {  
        const genericService = new GenericService();
  
        return genericService;
      }
}

export default GenericService;
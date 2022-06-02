import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { ConfigService } from './config.service';

export interface RatingModel {
  Rating : number;
  Comment : string;
}

@Injectable({
  providedIn: 'root'
})

export class RatingService {

  public SubmitResponseURL = "Feedback/Feedbacksubmit";

  public object : RatingModel = {
    Comment : "",
    Rating : 0
  }

  constructor(
    private http: HttpServiceService,
    private config: ConfigService
  ) { }

  public SubmitResponse(token, object)
  {
    debugger
    return new Promise((resolve, reject) => {
      this.http.postToCloseApi( this.config.server + this.SubmitResponseURL , object, token).subscribe((data: any) => {
        if (data.response) {
          if (data.response.code) {
            if (data.response.code == 1) {
              resolve(data);
              //this.data = data.response.content;
            }
          }
        }
      },
        Error => {
          resolve(Error);
        })
    });
  }
}

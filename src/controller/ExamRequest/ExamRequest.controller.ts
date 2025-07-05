import { Request, Response, NextFunction } from 'express';
import { ApiError } from './../../utils/ApiError';
import ExamRequestService from './../../services/examRequest.service';


export default class ExamRequestController {
    constructor(private examRequestService: ExamRequestService) { }

    j = async (req: Request, res: Response, next: NextFunction) => {
       
    }
   
}


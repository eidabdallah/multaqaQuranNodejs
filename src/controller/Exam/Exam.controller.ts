import { Request, Response, NextFunction } from 'express';
import { ApiError } from './../../utils/ApiError';
import ExamService from './../../services/exam.service';

export default class ExamController {
    constructor(private examService: ExamService) { }
    createExam = async (req: Request, res: Response, next: NextFunction) => {
      
    }
}


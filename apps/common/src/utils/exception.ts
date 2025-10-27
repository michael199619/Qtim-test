
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExFilter implements ExceptionFilter {
    catch(exception: HttpException | { status: HttpStatus, message: string }, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = 500;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res: any = exception.getResponse();
            message = typeof res === 'string' ? res : (res?.message ?? exception.message);
        } else if (exception.status) {
            status = exception.status || 500;
            message = exception.message ?? message;
        } else if (typeof exception === 'string') {
            message = exception;
        }

        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}

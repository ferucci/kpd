import {
  HttpException,
  HttpStatus,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response } from 'express';
import { MSG_ERROR } from 'src/vars';

export class UserAlreadyExistsException extends HttpException {
  constructor({ message }: { message: string }) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

@Catch(UserAlreadyExistsException)
export class EntityAlreadyExistsExceptionFilter implements ExceptionFilter {
  catch(exception: UserAlreadyExistsException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.getResponse();

    const ctx = host.switchToHttp();

    const req = ctx.getRequest();
    const res = ctx.getResponse();

    res.status(status).json({
      error: {
        status,
        message,
        method: req.method,
        url: req.url,
      },
    });
  }
}

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    res.status(HttpStatus.NOT_FOUND).json({
      message: {
        statusCode: HttpStatus.NOT_FOUND,
        message: MSG_ERROR.ontf,
      },
    });
  }
}

import { HttpStatus } from "@nestjs/common";

export class Response {
    static success({
        code = HttpStatus.OK,
        message = 'Success',
        data = null,
    }: {
        code?: number;
        message?: string;
        data?: any;
    }): any {
        return { code, message, data };
    }

    static created(message = 'Created', data: any) {
        return this.success({ code: HttpStatus.CREATED, message, data });
    }

    static error({
        code = HttpStatus.INTERNAL_SERVER_ERROR,
        message = 'Error',
        errors = null
    }: {
        code?: number,
        message?: string,
        errors?: any
    } = {}) {
        return { code, message, errors };
    }

    static notFound(message = 'Not Found') {
        return this.error({ code: HttpStatus.NOT_FOUND, message });
    }

    static badRequest(message = 'Bad Request', errors: any = null) {
        return this.error({ code: HttpStatus.BAD_REQUEST, message, errors });
    }

    static conflict(message = 'Conflict') {
        return this.error({ code: HttpStatus.CONFLICT, message });
    }
}
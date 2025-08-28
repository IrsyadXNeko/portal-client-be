import { HttpStatusCode } from "axios";

export class ResponseHelper {
    static success({
        code = HttpStatusCode.Ok,
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
        return this.success({ code: HttpStatusCode.Created, message, data });
    }

    static error({
        code = HttpStatusCode.InternalServerError,
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
        return this.error({ code: HttpStatusCode.NotFound, message });
    }

    static badRequest(message = 'Bad Request', errors: any = null) {
        return this.error({ code: HttpStatusCode.BadRequest, message, errors });
    }

    static conflict(message = 'Conflict') {
        return this.error({ code: HttpStatusCode.Conflict, message });
    }

    static unauthorized(message = 'Unauthorized') {
        return this.error({ code: HttpStatusCode.Unauthorized, message });
    }
}
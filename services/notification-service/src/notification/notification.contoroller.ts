import { Controller, Post, Body, HttpStatus } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { SendEmailDto } from "./dto/send-email.dto";
import { Response } from "src/common/helpers/response.helper";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Notification')
@Controller('send')
export class NoticationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    @ApiOperation({ summary: 'Send email, can use only the client id or the client email'})
    @ApiResponse({ status: HttpStatus.OK, description: 'Email sent successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to send email' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Recipient email not found' })
    async send(@Body() dto: SendEmailDto) {
        try {
            const result = await this.notificationService.send(dto);

            return Response.success({ message: 'Email sent successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Failed to send email', errors: err.message });
        }
    }
}
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SendEmailDto } from "./dto/send-email.dto";
import axios from "axios";
import { sendEmail } from "./email.helper";
import { getInternalAuthHeaders } from "src/common/helpers/internal-auth.helper";
import { ClientResponse } from "src/common/types/client-response.type";

@Injectable()
export class NotificationService {
    async send(dto: SendEmailDto) {
        console.log('start send email')
        let recipient = dto.email;

        if (!recipient && dto.toClientId) {
            console.log('start get email client')
            const res = await axios.get<ClientResponse>(`${process.env.CLIENT_SERVICE_URL}/clients/&{dto.toClientId}`,
                {
                    headers: await getInternalAuthHeaders(),
                }
            )

            console.log('recipient: ', res.data.data.email);
            recipient = res.data.data.email;
            console.log('recipient2: ', recipient);
        }

        if (!recipient) {
            console.log('failed to get email client')
            throw new HttpException('Recipient email not found', HttpStatus.NOT_FOUND);
        }

        console.log('2 recipient: ', recipient, ' subject: ', dto.subject, ' message: ', dto.message);

        await sendEmail(recipient, dto.subject, dto.message);
        return { to: recipient };
    }
}
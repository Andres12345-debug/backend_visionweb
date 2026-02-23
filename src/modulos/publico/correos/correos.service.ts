import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ContactoDto } from './dto/contacto.dto';

@Injectable()
export class CorreosService {

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async enviarFormulario(datos: ContactoDto) {

    await this.mailerService.sendMail({
      to: this.configService.get<string>('MAIL_TO'),
      subject: 'Nuevo mensaje desde VisionWeb',
      replyTo: datos.email, // 🔥 Permite responder al usuario
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${datos.nombre}</p>
        <p><strong>Email:</strong> ${datos.email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${datos.mensaje}</p>
        <hr/>
        <small>Enviado desde formulario web</small>
      `,
    });

    return { mensaje: 'Correo enviado correctamente' };
  }
}
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ContactoDto } from './dto/contacto.dto';
import { Repository } from 'typeorm';
import { Correos } from '../../../modelos/correos/correos';
import { ResponderCorreoDto } from './dto/responderCorreo.dto';

@Injectable()
export class CorreosService {

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectRepository(Correos) private readonly correosRepo: Repository<Correos>,
  ) {}

  async enviarFormulario(datos: ContactoDto) {

    // 🔥 1️⃣ Guardar en base de datos
    const nuevoCorreo = this.correosRepo.create({
      nombre: datos.nombre,
      email: datos.email,
      mensaje: datos.mensaje,
    });

    await this.correosRepo.save(nuevoCorreo);

    // 🔥 2️⃣ Enviar correo
    await this.mailerService.sendMail({
      to: this.configService.get<string>('MAIL_TO'),
      subject: 'Nuevo mensaje desde VisionWeb',
      replyTo: datos.email,
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

    return { mensaje: 'Correo enviado y guardado correctamente' };
  }

  // 🔥 GET TODOS
  async obtenerCorreos(): Promise<Correos[]> {
    return this.correosRepo.find({
      order: { fecha: 'DESC' }
    });
  }

  // 🔥 GET POR ID
  async obtenerCorreoPorId(id: number): Promise<Correos | null> {
    return this.correosRepo.findOne({
      where: { id }
    });
  }

  async responderCorreo(datos: ResponderCorreoDto) {

    // buscar el correo
    const correo = await this.correosRepo.findOne({
      where: { id: datos.id }
    });

    if (!correo) {
      throw new HttpException('Correo no encontrado', HttpStatus.NOT_FOUND);
    }

    // enviar correo
    await this.mailerService.sendMail({

      to: datos.email,
      subject: datos.asunto,

      html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Respuesta a tu mensaje</h2>

        <p>${datos.mensaje}</p>

        <hr/>

        <small>
          Este correo fue enviado desde el equipo de Vision Web
        </small>
      </div>
    `

    });

    // 🔹 marcar como respondido
    correo.respondido = true;
    correo.fechaRespuesta = new Date();

    await this.correosRepo.save(correo);

    return {
      mensaje: 'Respuesta enviada correctamente'
    };

  }
}
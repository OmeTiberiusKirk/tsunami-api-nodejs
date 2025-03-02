import { Injectable, Logger } from '@nestjs/common'
import { CreateUserDto } from './user.dto'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { MailerService } from '@nestjs-modules/mailer'
import * as pug from 'pug'
import { PrismaService } from 'src/prisma.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  private adminEmail: string
  private adminPass: string

  constructor(
    private mailerService: MailerService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    void this.init()
    this.adminEmail = this.config.get('ADMIN_EMAIL') || 'tsunami@example.com'
    this.adminPass = this.config.get('ADMIN_PASS') || 'P@ssw0rd'
  }

  async init() {

    try {
      const u = await this.prisma.user.findFirst({ where: { email: this.adminEmail } })
      if (!u) {
        await this.prisma.user.create({
          data: {
            name: 'super',
            surname: 'admin',
            email: this.adminEmail,
            password: await this.hashPassword(this.adminPass),
            role: 'superadmin',
            position: 'central',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async create(values: CreateUserDto) {
    try {
      const password = this.generatePassword()
      const hashedPassword = await this.hashPassword(password)
      const user = {
        ...values,
        password: hashedPassword,
      }

      await this.prisma.user.create({ data: user })
      // await this.sendPasswordToEmail(values, password)

      return { ...user, password }
    } catch (error) {
      this.logger.error(error)
      throw <Error>error
    }
  }

  private async hashPassword(pass: string) {
    const saltOrRounds = 10
    const hash = await bcrypt.hash(pass, saltOrRounds)
    return hash
  }

  private generatePassword(length: number = 20) {
    const characters =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
    const pass = Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => characters[x % characters.length])
      .join('')
    return pass
  }

  private async sendPasswordToEmail(values: CreateUserDto, pass: string) {
    const compiledFunction = pug.compileFile(
      process.cwd() + '/src/user/templates/test.pug',
    )
    const emailHTML = compiledFunction({
      subject: `สวัสดี ${values.name} ${values.surname}`,
      receiver: {
        email: values.email,
        pass,
      },
    })
    await this.mailerService.sendMail({
      to: values.email, // list of receivers
      from: 'nukool@40.co.th', // sender address
      subject: 'รหัสผ่าน ✔', // Subject line
      html: emailHTML, // HTML body content
    })
  }
}

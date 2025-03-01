import { Inject, Injectable, Logger } from '@nestjs/common'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { CreateUserDto } from './user.dto'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { MailerService } from '@nestjs-modules/mailer'
import * as pug from 'pug'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private mailerService: MailerService,
    private prisma: PrismaService
  ) {
    void this.init()
  }

  async init() {

    try {
      const u = await this.prisma.user.findFirst({ where: { email: 'tsunami@example.com' } })
      if (!u) {
        await this.prisma.user.create({
          data: {
            name: 'super',
            surname: 'admin',
            email: 'tsunami@example.com',
            password: await this.hashPassword('abc456'),
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
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .execute()

      await this.sendPasswordToEmail(values, password)

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
      subject: `สวัสดี ${values.name} ${values.surName}`,
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

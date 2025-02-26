import { MigrationInterface, QueryRunner } from 'typeorm'
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config({ path: process.cwd() + '/.env' })

export class Init1740544758481 implements MigrationInterface {
  name = 'Init1740544758481'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await hashPassword(
      process.env.ADMIN_PASS || 'abc456',
    )

    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "name" character varying(500) NOT NULL,
        "surName" character varying(500) NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" "public"."users_role_enum" NOT NULL,
        "permissions" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )

    await queryRunner.query(`INSERT INTO "users" VALUES(
        1, 'sakda', 'thubtuk',
        '${process.env.ADMIN_EMAIL || 'tsunami@example.com'}', '${hashedPassword}',
        'admin', ''
    )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
  }
}

const hashPassword = async (pass: string) => {
  const saltOrRounds = 10
  const hash = await bcrypt.hash(pass, saltOrRounds)
  return hash
}

import { Repository, EntityRepository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";


@EntityRepository(User)
export class UserRepository extends Repository<User>{
  
  async singUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, user.salt)

    try {
      await user.save();
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username alredy exists')
      } else {
        throw new InternalServerErrorException
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username })

    if (user && await user.validatePassword(password)) {
      return user.username
    } else {
      return null
    }

  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}
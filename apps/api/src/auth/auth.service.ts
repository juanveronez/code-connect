import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    if (this.usersService.findByEmail(dto.email)) {
      throw new ConflictException('Email already in use');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });
    return { id: user.id, name: user.name, email: user.email };
  }

  async signIn(dto: LoginDto): Promise<AuthResponseDto> {
    const user = this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}

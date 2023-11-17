import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (user?.password !== pass) {
      throw new UnauthorizedException("Wrong password");
    }

    const { password, ...result } = user;
    console.log("🚀 ~ password:", password);
    // TODO: Generate a JWT and return it here
    // instead of the user object

    const payload = { sub: user.userId, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);

    return { ...result, access_token };
  }

  async signUp(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user) {
      throw new UnauthorizedException("User already exists");
    }

    return this.usersService.create({ username, password: pass });
  }
}

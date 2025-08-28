import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { LoginDto } from "src/user/dto/login.dto";
import * as bcrpyt from "bcrypt";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import * as dotenv from 'dotenv';
import axios from "axios";
dotenv.config();

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private readonly jwtService: JwtService) { }

    async comparePasswords(data: string, hash: string) {
        return bcrpyt.compare(data, hash);
    }

    async validatorUsernameRegis(createDto: CreateUserDto) {
        const user = await this.userService.findByUsername(createDto.username);
        return user ? true : false;
    }

    async validatorEmailRegis(createDto: CreateUserDto) {
        const email = await this.userService.findByEmail(createDto.email);
        return email ? true : false;
    }

    async validatorUserLogin(loginDto: LoginDto) {
        const user = await this.userService.findByUsername(loginDto.username);
        if (!user) return null;
        const isValid = await this.comparePasswords(loginDto.password, user.password);
        return isValid ? user : null;
    }

    async generateTokens(user: any) {
        const res = await axios.get(`${process.env.CLIENT_SERVICE_URL}/clients/client-id/${user.id}`,);
        const clientData = res.data?.data;
        console.log("==> Client: ", clientData);
        const payload = {
            sub: user.id,
            client_id: clientData ? clientData.id : 0,
            role: user.role,
            username: user.username,
            email: user.email,
            force_password_change: user.force_password_change
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_SECRET,
            expiresIn: process.env.REFRESH_EXPIRES_IN,
        })

        return { accessToken, refreshToken };
    }

    async verifyRefreshToken(token: string) {
        return this.jwtService.verifyAsync(token, { secret: process.env.REFRESH_SECRET });
    }
}
import { Controller, Post, Body, UseGuards, Get, Req, Param, ParseIntPipe, HttpException, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginDto } from "src/user/dto/login.dto";
import { ChangePasswordDto } from "src/user/dto/change-password.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AdminGuard } from "src/common/guards/admin.guard";
import { Response } from "src/common/helpers/response.helper";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Create account admin/client' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Registration successful'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Registration failed'})
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Username/Email already exist'})
    async register(@Body() dto: CreateUserDto) {
        try {
            const checkUsername = await this.authService.validatorUsernameRegis(dto);
            if (checkUsername) return Response.conflict('Username already exist');

            const checkEmail = await this.authService.validatorEmailRegis(dto);
            if (checkEmail) return Response.conflict('Email already exist');

            const result = await this.userService.createUser(dto);
            return Response.created('Registration successful', result);
        } catch (err) {
            return Response.error({ message: 'Registration failed', errors: err.message });
        }
    }

    @Post('login')
    @ApiOperation({ summary: 'Login account admin/client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Login successful'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Login error occurred'})
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Invalid username or password'})
    async login(@Body() dto: LoginDto) {
        try {
            const user = await this.authService.validatorUserLogin(dto);
            if (!user) return Response.conflict('Invalid username or password');

            const tokens = await this.authService.generateTokens(user);

            console.log("===> user:", user);
            console.log("===> tokens:", tokens);
            return Response.success({ 
                message: user.force_password_change && user.role == 'client' ? 'Please change your password first' : 'Login successful',
                data: {
                    user: { id: user.id, role: user.role },
                    forcePasswordChange: user.force_password_change,
                    ...tokens,
                },
            });
        } catch (err) {
            console.log('❌ Error:', err.message);
            return Response.error({ message: 'Login error occurred', errors: err.message });
        }
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Change password account admin/client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Password change successful'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Password change failed'})
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Invalid current password'})
    async changePassword(@Body() dto: ChangePasswordDto) {
        try {
            const user = await this.userService.findById(dto.userId);
            const match = await this.authService.comparePasswords(dto.oldPassword, user.password);
            if (!match) return Response.conflict('Invalid current password');

            await this.userService.updatePassword(dto.userId, dto.newPassword);
            return Response.success({ message: 'Password change successful' });
        } catch (err) {
            return Response.error({ message: 'Password change failed', errors: err.message });
        }
    }

    @Post('refresh-token')
    @ApiOperation({ summary: 'Refresh token jwt' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Token updated'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Invalid refresh tokend'})
    async refreshToken(@Body() body: any) {
        try {
            const payload = await this.authService.verifyRefreshToken(body.refreshToken);
            const user = await this.userService.findById(payload.sub);
            const tokens = await this.authService.generateTokens(user);
            return Response.success({ message: 'Token updated', data: tokens });
        } catch (err) {
            return Response.error({ message: 'Invalid refresh token', errors: err.message });
        }
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get profile account admin/client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get Profile Successfully'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to retrieve profile'})
    async getProfile(@Req() req) {
        try {
            console.log('📨 User:', req.user);
            return Response.success({ message: 'Get Profile Successfully', data: req.user, });
        } catch (err) {
            return Response.error({ message: 'Failed to retrieve profile', errors: err.message });
        }
    }

    @Get('user/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Get 1 account admin/client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User found'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to retrieve user'})
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found'})
    async getUser(@Param('id', ParseIntPipe) id: number) {
        try {
            const user = await this.userService.findById(id);

            if (!user) {
                return { code: 404, message: 'User not found'}
            }

            return Response.success({ message: 'User found', data: { id: user.id, role: user.role } });
        } catch (err) {
            return Response.error({ message: 'Failed to retrieve user', errors: err.message });
        }
    }

    @Get('users')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Get all account admin/client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get users successfuly'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to retrieve user'})
    async getAllUser() {
        try {
            const user = await this.userService.findAllUser();

            return Response.success({ message: 'Get users successfuly', data: user });
        } catch (err) {
            return Response.error({ message: 'Failed to retrieve user', errors: err.message });
        }
    }
}
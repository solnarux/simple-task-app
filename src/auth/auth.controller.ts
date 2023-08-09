import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto);
    }

    @Post('/signup')
    signup(@Body() dto: AuthDto) {
        console.log({dto});
        return this.authService.signup(dto);
    }
}
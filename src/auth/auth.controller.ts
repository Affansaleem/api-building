import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthServices } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController
{
    constructor(private authService:AuthServices)
    {
    }

    @Post('signup')
    signup(@Body() dto:AuthDto)
    {
        console.log({
            dto,
    });
        return this.authService.signup(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto:AuthDto)
    {
        // console.log(dto);
        return this.authService.signin(dto);
    }

}
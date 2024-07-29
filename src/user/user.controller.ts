import { Body, Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUserDeco } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {

    // now this route is being protected by this guard jwt strategy
    // From validate the payload came into this controller and then it is returened
    
    @Get('me')
    async getMe(@GetUserDeco() user: User)
    {
        return user;
    }

}

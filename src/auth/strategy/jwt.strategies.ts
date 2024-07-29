import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

// Any class that is using some other class service will use Injectable decorator.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt')
{
    constructor(private config:ConfigService, private prisma:PrismaService)
    {
        // const secret= this.config.get("JWT_SECRET");
        super({
            jwtFromRequest: 
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET"),
            
        })
    }

    async validate(payload: {
        UserId: number,
        email: string
    })
    {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.UserId
            }
        })
        console.log({payload})
        delete user.hash;
        return user;
    }
    
}
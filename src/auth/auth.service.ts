import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon2 from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthServices
{
    constructor(private prisma: PrismaService,private jwt:JwtService,private config:ConfigService)
    {

    }
    async signin(dto:AuthDto)
    {
        // find uer in the db
        const user= await this.prisma.user.findUnique({
            where:{
            email: dto.email,
            }
        });
        // if doesnot exist throw exception
        if(!user)
        {
            throw new ForbiddenException('Credentials Incorrect');
        }
        // compare password

        const pwMatches= await argon2.verify(user.hash,dto.password);

        // if incorrect throw exception
        if(!pwMatches)
        {
            throw new ForbiddenException("Credentials Invalid");
            
        }
        //send back user if everythhing good
        // delete user.hash;
        return this.signToken(user.id,user.email);
    }
    async signup(dto:AuthDto){
        // Step1: Generate passed password hash
        const hash = await argon2.hash(dto.password);
        // Step2: save the user in db

        try {const user = await this.prisma.user.create({
            data:{
                email: dto.email,
                hash,
            },
            // select:
            // {
            //     id:true,
            //     email:true,
            //     firstName:true,
            //     lastName:true,
            //     createdAt:true
            // }
        })
        // This will remove the hash from user response
        // delete user.hash;

        // return user;
        return this.signToken(user.id,user.email);

    }
        catch (e)
        {
            // If error is from Prisma client then this runs
            if(e instanceof PrismaClientKnownRequestError)
            {
                // This code is for duplicate fields
                if(e.code === 'P2002')
                {
                    throw new ForbiddenException('Credentials taken already')
                }
            }
            throw e;
        }
        // Step3: Return the saved user

    }


    async signToken(userId: number,email:string)
    {
        // This oayload will define how data will be show as we decode the jwt token
        // Example response:
        // {
        //     "UserId": 4,
        //     "email": "m.affansalim786@gmail.com",
        //     "iat": 1720866890,
        //     "exp": 1720867790
        //   }
        const payload= {
            UserId: userId,
            email
        }
        const secret = this.config.get('JWT_SECRET');
        const token= await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        })
        // Returning an object
        return {
            access_token: token,
        }

    }
}
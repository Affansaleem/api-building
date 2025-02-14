import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";


@Module({
    imports:[JwtModule.register({
    })],
    controllers: [AuthController],
    providers: [AuthServices,JwtStrategy]
})
export class AuthModule
{
}
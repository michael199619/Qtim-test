import { Injectable,NestMiddleware } from "@nestjs/common";
import { NextFunction,Request,Response } from "express";
import { AuthService } from "../auth";
import { ContextService } from "./context.service";

@Injectable()
export class ContextMiddleware implements NestMiddleware {
    constructor(
        private readonly ctx: ContextService,
        private readonly authService: AuthService,
    ) { }

    async use(req: Request,res: Response,next: NextFunction) {
        this.ctx.req=req;
        this.ctx.res=res;

        if (this.ctx.accessToken) {
            try {
                this.ctx.payload=await this.authService.verifyJwtToken(this.ctx.accessToken)
            } catch (e) {
                console.error(e)
            }
        }

        next();
    }
}
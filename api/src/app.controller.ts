import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { JwtGuard } from './auth/jwt/guards';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  getHello(@Req() request: Request,
  @Res({ passthrough: true }) response: Response
  ): any {
    return JSON.stringify({message:'BONJOURNO'})
  }
}

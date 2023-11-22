import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { InsertUser, LoginUserDto, RegisterUserDto, UserExist } from './user-dto/user-dto';
import { Request, Response } from 'express';


@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Get()
    findAll() {
        return 'This action returns all cats'
    }

    @Get('all')
    allUsers(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
        ): any {
        console.log(request.cookies);
        
        let users = this.userService.findAll();
        // console.log(response);
        
        return users;
        // return 'This action returns all cats'
    }

    
    @Post('register_user')
    async registerUser(
        @Res() res: Response, 
        @Body() userRegisterDto: RegisterUserDto
        ) {

        const email: string = userRegisterDto.email;
        const username: string = userRegisterDto.username;
        const isUserExisting: UserExist = await this.userService.doesUserExist(email,username);

        if (isUserExisting.userExist) {
            res.status(HttpStatus.NOT_ACCEPTABLE).send("registration failed" + JSON.stringify(isUserExisting));
        } else {
            const hashSaltPassword: string = await this.userService.generateHashSaltPassword(userRegisterDto.password);
            userRegisterDto.password = hashSaltPassword; // replace text password with hash/salt password
            const insertResponse: InsertUser = await this.userService.insertNewUser(userRegisterDto);
            res.status(HttpStatus.OK).send("registration successful" + JSON.stringify(insertResponse));
            // todo: send registration confirmation email
            // todo: create user specific database tables
            this.userService.generateDbTablesForNewUser(insertResponse.userId);
            // todo: treat user as logged in and retrieve session token just like at login
        };
    };


    @Post('login_user')
    async loginUser(
        @Res() res: Response, 
        @Body() userLoginDto: LoginUserDto
        ) {        
        const isloginValidated: boolean = await this.userService.validateLoginCredentials(userLoginDto);

        if (!isloginValidated) {
            res.status(HttpStatus.BAD_REQUEST).send("login failed");
        } else {
            // todo: grab existing user data from db
            const userData = {data: 'placeholder'}
            res.status(HttpStatus.OK).send("login successful" + JSON.stringify(userData));
        }
    };  

}
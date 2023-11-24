import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { InsertUser, LoginUserDto, RegisterUserDto, UserExist, UserLoginData } from './auth-dto/auth-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
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
      
      let users = this.authService.findAll();
      // console.log(response);
      
      return users;
      // return 'This action returns all cats'
  }


  @Post('register_user')
  async registerUser(
      @Res() res: Response, 
      @Body() userRegisterDto: RegisterUserDto
      ) {
        console.log('in register user');
        
      const email: string = userRegisterDto.email;
      const username: string = userRegisterDto.username;
      const isUserExisting: UserExist = await this.authService.doesUserExist(email,username);
        console.log('iseUserExist: ', isUserExisting);
        
      if (isUserExisting.userExist) {
          let existType: string;
          if (isUserExisting.email && isUserExisting.username) {
            existType = 'email and username already exist';
          } else if (isUserExisting.email) {
            existType = 'email already exists';
          } else {
            existType = 'username already exists';
          }
          console.log('isUserexist type: ', existType);
          
          throw new HttpException(`registration failed - ${existType}`, HttpStatus.BAD_REQUEST);
      } else {
          const hashSaltPassword: string = await this.authService.generateHashSaltPassword(userRegisterDto.password);
          userRegisterDto.password = hashSaltPassword; // replace text password with hash/salt password
          console.log('hashpass: ', hashSaltPassword);
          
          const insertResponse: InsertUser = await this.authService.insertNewUser(userRegisterDto);
          console.log('insert response: ', insertResponse);
          
          res.status(HttpStatus.OK).send({message: "registration successful", data: JSON.stringify(insertResponse)});
          // todo: send registration confirmation email
          this.authService.generateDbTablesForNewUser(insertResponse.userId);
      };
  };

  // basic jwt login example for testing
  @Get('login')
  async login(@Res({ passthrough: true }) res) {
    // todo: replace with real username/id
    const payload = { username: 'john', id: 1 };
    res.cookie('cashamole_user_token', this.jwtService.sign(payload), {
      expires: new Date(Date.now() + 3600000),
    });
    return {};
  }
  // basic jwt logout example for testing
  @Get('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.cookie('cashamole_user_token', '', { expires: new Date(Date.now()) });
    return {};
  }

  @Post('login_user')
  async loginUser(
      @Res() res: Response, 
      @Body() userLoginDto: LoginUserDto
      ) {        
      const isloginValidated: boolean = await this.authService.validateLoginCredentials(userLoginDto);
      if (!isloginValidated) {
          throw new HttpException('login failed', HttpStatus.BAD_REQUEST);
      } else {
          const userLoginData: UserLoginData = await this.authService.getUserDataOnSuccessfulValidation(userLoginDto.username);
          const username: string = userLoginData.basicProfile.username;
          const userId: number = <number>userLoginData.basicProfile.id;
          const payload = { username: username, id: userId };
          res.cookie('cashamole_user_token', this.jwtService.sign(payload), {
            expires: new Date(Date.now() + 3600000),
          });
          res.status(HttpStatus.OK).send({message: 'login successful', data: JSON.stringify(userLoginData)});
      };
  };  
}

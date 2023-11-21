import { Body, Controller, Get, Header, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { InsertUser, RegisterUserDto, UserExist } from './register-user-dto/register-user-dto';
import { Response } from 'express';


@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Get()
    findAll() {
        return 'This action returns all cats'
    }

    
    @Post('register_user')
    async registerUser(
        @Res() res: Response, 
        @Body() userRegisterDto: RegisterUserDto
        ) {
        // let users = this.userService.findAll();
        const email: string = userRegisterDto.email;
        const username: string = userRegisterDto.username;
        const isUserExisting: UserExist = await this.userService.doesUserExist(email,username);

        if (!isUserExisting.userExist) {
            const insertResponse: InsertUser = await this.userService.insertNewUser(userRegisterDto);
            res.status(HttpStatus.ACCEPTED).send("successful" + JSON.stringify(insertResponse));
            // todo: send registration confirmation email
            // todo: create user specific database tables
        } else {
            res.status(HttpStatus.NOT_ACCEPTABLE).send("failed" + JSON.stringify(isUserExisting));
        };
    };


    @Post('login_user')
    async loginUser(
        @Res() res: Response, 
        @Body() userRegisterDto: RegisterUserDto
        ) {
        // let users = this.userService.findAll();
        const email: string = userRegisterDto.email;
        const username: string = userRegisterDto.username;
        const isUserExisting: UserExist = await this.userService.doesUserExist(email,username);

        if (!isUserExisting.userExist) {
            const insertResponse: InsertUser = await this.userService.insertNewUser(userRegisterDto);
            res.status(HttpStatus.ACCEPTED).send("successful" + JSON.stringify(insertResponse));
            // todo: send registration confirmation email
            // todo: create user specific database tables
        } else {
            res.status(HttpStatus.NOT_ACCEPTABLE).send("failed" + JSON.stringify(isUserExisting));
        };
    };


    /**
 * Verifies if username exists and then registers/inserts new user to database
 */
// app.post('/login_user', async (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     const username = req.body.username;
//     const password = req.body.password;
//     const loginValidation = await validateLoginCredentials(username, password);
//     // const userId = 1; // should get userId from db to add to generate token field
//     // todo: if autheticated and additional data for user required, set db query function here
//     if (!loginValidation.isLoginValidated) {
//         res.status(400).json({message: 'Username/Password incorrect'});
//       } else {
//         const token = jwtService.generateToken({ userId: loginValidation.userId, username: username});
//         console.log(token);
//         res.status(201).json({message: 'Login Successful'});
//       }
//     }
//   )
  
  // Helper function for app.post('/loginuser')
//   async function validateLoginCredentials(username, password) {
//     const sql = `SELECT * FROM users WHERE username= ? AND password= ?`;
//     const result = await con.promise().query(sql, [username, password])
//       .then( ([row, fields]) => {
//         console.log(row);
//         console.log(fields);
//         const isLoginValidated = row && row.length === 1;
//         const userId = 0; // todo: once userId is column in table, should be row.id
//         return { userId: userId, isLoginValidated: isLoginValidated}
//       });
//     return result;
//   }
}

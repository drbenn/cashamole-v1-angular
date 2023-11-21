import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { InsertUser, LoginUserDto, RegisterUserDto, UserExist } from './register-user-dto/register-user-dto';

@Injectable()
export class UserService {
    constructor(@InjectClient() private readonly connection: Connection) {}

    async findAll() {
      const users = await this.connection.query('SELECT * FROM users');
      const results = Object.assign([{}], users[0]);
      return results;
    }

    async doesUserExist(email: string, username: string): Promise<UserExist> {
        const sqlQuery: string = `SELECT * FROM users WHERE username = '${username}' OR email = '${email}';`
        const existingUser = await this.connection.query(sqlQuery)
        const results = Object.assign([{}], existingUser[0]);
        
        let userResult: UserExist = {
            userExist: false,
            username: false,
            email: false
        };

        if (results.length) {
            results.forEach((result: any) => {
                if (result.username === username) {
                    userResult.username = true;
                    userResult.userExist = true;
                }
                if (result.email === email) {
                    userResult.email = true;
                    userResult.userExist = true;
                }
            })
        }
        return userResult;
    }

    async insertNewUser(userRegisterDto: RegisterUserDto): Promise<InsertUser> {
        const shaPassword: string = await this.generateSha256(userRegisterDto.password)
        const sqlQuery: string = `INSERT INTO users (email, username, password) VALUES (\'${userRegisterDto.email}\', \'${userRegisterDto.username}\', \'${shaPassword}\')`;
        const registeredUser = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], registeredUser[0]);
        const success: boolean = results.affectedRows > 0 ? true : false;
        return {insertSuccessful: success, username: userRegisterDto.username, email: userRegisterDto.email};
    }

    async generateSha256(password: string): Promise<string> {
        const passwordAsArrayBuffer: ArrayBuffer = new TextEncoder().encode(password);
        const shaPasswordBuffer: ArrayBuffer =  await crypto.subtle.digest('SHA-256', passwordAsArrayBuffer);
        const decoder = new TextDecoder('utf-8');
        const shaPassword: string = decoder.decode(shaPasswordBuffer);
        return shaPassword;
    }



    async validateLoginCredentials(loginUserDto: LoginUserDto) {
        const shaPassword: string = await this.generateSha256(loginUserDto.password)
        const sqlQuery: string = `SELECT * FROM users WHERE username='${loginUserDto.username} AND password='${shaPassword}'`;
        const authenticateUser = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], authenticateUser[0]);
        console.log(results);
        
        // const result = await con.promise().query(sql, [username, password])
        // .then( ([row, fields]) => {
        //     console.log(row);
        //     console.log(fields);
        //     const isLoginValidated = row && row.length === 1;
        //     const userId = 0; // todo: once userId is column in table, should be row.id
        //     return { userId: userId, isLoginValidated: isLoginValidated}
        // });
        // return result;
    }

}

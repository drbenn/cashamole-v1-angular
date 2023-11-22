import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { InsertUser, LoginUserDto, RegisterUserDto, UserExist } from './user-dto/user-dto';
import * as bcrypt from 'bcrypt';

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
        
        let userExistResult: UserExist = {
            userExist: false,
            username: false,
            email: false
        };

        if (results.length) {
            results.forEach((result: any) => {
                if (result.username === username) {
                    userExistResult.username = true;
                    userExistResult.userExist = true;
                }
                if (result.email === email) {
                    userExistResult.email = true;
                    userExistResult.userExist = true;
                }
            })
        }
        return userExistResult;
    }

    async insertNewUser(userRegisterDto: RegisterUserDto): Promise<InsertUser> {        
        const sqlQuery: string = `INSERT INTO users (email, username, password) 
            VALUES (\'${userRegisterDto.email}\', \'${userRegisterDto.username}\', \'${userRegisterDto.password}\')`;
        const registeredUser = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], registeredUser[0]);
        console.log(results);
        
        const success: boolean = results.affectedRows > 0 ? true : false;
        return {insertSuccessful: success, userId: results.insertId, username: userRegisterDto.username, email: userRegisterDto.email};
    }

    // The salt gets automatically included with the hash, so you do not need to store it in a database.
    async generateHashSaltPassword(password: string): Promise<string | any> {
        const saltRounds: number = 10;
        return await bcrypt.hash(password, saltRounds, null);
    }

    async generateDbTablesForNewUser(userId: number) {
        this.generateUserTransactionsTable(userId);
        this.generateUserBalanceSheetTable(userId);
        this.generateUserChipsTable(userId);
    }

    async generateUserTransactionsTable(userId: number) {
        const sqlQuery: string = `
            CREATE TABLE IF NOT EXISTS user${userId}_transactions (
            trans_id INT PRIMARY KEY AUTO_INCREMENT,
            date DATETIME NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(250) NOT NULL,
            description VARCHAR(100) NOT NULL,
            active BOOLEAN NOT NULL
        )`;
        const queryDb = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], queryDb[0]);
        console.log(results);
    }

    async generateUserBalanceSheetTable(userId: number) {
        const sqlQuery: string = `
            CREATE TABLE IF NOT EXISTS user${userId}_bal_sheet (
            trans_id INT PRIMARY KEY AUTO_INCREMENT,
            date DATETIME NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            type VARCHAR(50) NOT NULL,
            description VARCHAR(100) NOT NULL,
            active BOOLEAN NOT NULL
        )`;
        const queryDb = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], queryDb[0]);
        console.log(results);
    }

    async generateUserChipsTable(userId: number) {
        const sqlQuery: string = `
            CREATE TABLE IF NOT EXISTS user${userId}_chips (
            id INT PRIMARY KEY AUTO_INCREMENT,
            type VARCHAR(50) NOT NULL,
            chip VARCHAR(200) NOT NULL,
            active BOOLEAN NOT NULL
        )`;
        const queryDb = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], queryDb[0]);
        console.log(results);
    }

    async validateLoginCredentials(loginUserDto: LoginUserDto): Promise<boolean> {
        const sqlQuery: string = `SELECT password FROM users WHERE username='${loginUserDto.username}'`;
        const hashSaltPasswordFromDbQuery = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], hashSaltPasswordFromDbQuery[0]);
        const dbHashSaltPassword: string = `${results[0].password}`;
        const isMatch: boolean = await bcrypt.compare(loginUserDto.password, dbHashSaltPassword);
        if (!isMatch) {
            return false;
        } else {
            return true;
        }
    }

}

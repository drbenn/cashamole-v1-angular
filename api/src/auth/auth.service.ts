import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { InsertUser, LoginUserDto, RegisterUserDto, UserBalanceSheetEntry, UserBasicProfile, UserChip, UserExist, UserLoginData, UserTransaction } from './auth-dto/auth-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
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
            vendor VARCHAR(100) NOT NULL,
            note VARCHAR(100),
            active BOOLEAN NOT NULL
        )`;
        const queryDb = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], queryDb[0]);
        console.log(results);
    }

    async generateUserBalanceSheetTable(userId: number) {
        const sqlQuery: string = `
            CREATE TABLE IF NOT EXISTS user${userId}_bal_sheet (
            record_id INT PRIMARY KEY AUTO_INCREMENT,
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

    async getUserDataOnSuccessfulValidation(username: string): Promise<UserLoginData> {
        const userBasicProfile: UserBasicProfile = await this.getUserBasicProfile(username);
        
        
        const userTransactions: UserTransaction[] = await this.getUserTransactions(userBasicProfile.id);
        const userBalanceSheetEntries: UserBalanceSheetEntry[] = await this.getUserBalanceSheetEntries(userBasicProfile.id);
        const userChips: UserChip[] = await this.getUserChips(userBasicProfile.id);
        // const sqlQuery: string = `SELECT (id, username, email, join_date) FROM users WHERE username='${username}'`;
        // const basicUserData = await this.connection.query(sqlQuery);
        // const results = Object.assign([{}], basicUserData[0]);
        // console.log(results);
        const userLoginData: UserLoginData = {
            basicProfile: userBasicProfile,
            transactions: userTransactions,
            balanceSheetEntries: userBalanceSheetEntries,
            chips: userChips
        }
        return userLoginData;
    }

    async getUserBasicProfile(username: string): Promise<UserBasicProfile> {
        const sqlQuery: string = `SELECT id, username, email, join_date FROM users WHERE username='${username}'`;
        const basicUserData = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], basicUserData[0]);
        return results[0];
    }

    async getUserTransactions(userId: number): Promise<UserTransaction[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_transactions`;
        const userTransactions = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userTransactions[0]);
        return this.checkForReturnValues(results);
    }

    async getUserBalanceSheetEntries(userId: number): Promise<UserBalanceSheetEntry[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_bal_sheet`;
        const userBalanceSheetEntries = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userBalanceSheetEntries[0]);
        return this.checkForReturnValues(results);
    }

    async getUserChips(userId: number): Promise<UserChip[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_chips`;
        const userChips = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userChips[0]);
        return this.checkForReturnValues(results);
    }

    private checkForReturnValues(results: any): UserTransaction[] | UserBalanceSheetEntry[] | UserChip[] | null | any {
        // if no values return(if table is empty will still return length of 1, but of an object with no key/value pairs)
        if (Object.keys(results[0]).length === 0 && results.length === 1) {
            return null;
        } else {
            return results;
        };
    }
}

import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { InsertUser, LoginUserDto, RegisterUserDto, UserBasicProfile, UserExist, UserLoginData } from './auth-dto/auth-dto';
import * as bcrypt from 'bcrypt';
import { IncomeDto } from 'src/income/income-dto/income-dto';
import { ExpenseDto } from 'src/expense/expense-dto/expense-dto';
import { BalanceRecordDto } from 'src/balance_sheet/balance_sheet-dto/balance_sheet-dto';
import { ChipDto } from 'src/chip/chip-dto/chip-dto';
import { IncomeService } from 'src/income/income.service';
import { InvestDto } from 'src/invest/invest-dto/invest-dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectClient() private readonly connection: Connection,
        // private incomeService: IncomeService
        
        
        ) {}

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
    };

    async insertNewUser(userRegisterDto: RegisterUserDto): Promise<InsertUser> {    
        userRegisterDto.status = 'active';    
        const sqlQuery: string = `INSERT INTO users (email, username, password, status) 
            VALUES (\'${userRegisterDto.email}\',
                    \'${userRegisterDto.username}\',
                    \'${userRegisterDto.password}\',
                    \'${userRegisterDto.status}\'
                    )`;
        const registeredUser = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], registeredUser[0]);
        
        const success: boolean = results.affectedRows > 0 ? true : false;
        return {insertSuccessful: success, userId: results.insertId, username: userRegisterDto.username, email: userRegisterDto.email};
    };

    // The salt gets automatically included with the hash, so you do not need to store it in a database.
    async generateHashSaltPassword(password: string): Promise<string | any> {
        const saltRounds: number = 10;
        return await bcrypt.hash(password, saltRounds, null);
    };

    async generateDbTablesForNewUser(userId: number) {
        this.generateUserExpenseTable(userId);
        this.generateUserIncomeTable(userId);
        this.generateUserInvestTable(userId);
        this.generateUserBalanceSheetTable(userId);
        this.generateUserChipsTable(userId);
    };

    async generateUserIncomeTable(userId: number) {
        const sqlQuery: string = `
            CREATE TABLE IF NOT EXISTS user${userId}_income (
            inc_id INT PRIMARY KEY AUTO_INCREMENT,
            date VARCHAR(250) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            source VARCHAR(100) NOT NULL,
            note VARCHAR(100),
            status VARCHAR(25) NOT NULL
        )`;
        const queryDb = await this.connection.query(sqlQuery);
        // const results = Object.assign([{}], queryDb[0]);
    };

    async generateUserExpenseTable(userId: number) {
        const sqlQuery: string = `
            CREATE TABLE IF NOT EXISTS user${userId}_expenses (
            exp_id INT PRIMARY KEY AUTO_INCREMENT,
            date VARCHAR(250) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(250) NOT NULL,
            vendor VARCHAR(100) NOT NULL,
            note VARCHAR(100),
            status VARCHAR(25) NOT NULL
        )`;
        const queryDb = await this.connection.query(sqlQuery);
        // const results = Object.assign([{}], queryDb[0]);
    };

    async generateUserInvestTable(userId: number) {
        const sqlQuery: string = `
            CREATE TABLE IF NOT EXISTS user${userId}_invest (
            inv_id INT PRIMARY KEY AUTO_INCREMENT,
            date VARCHAR(250) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            institution VARCHAR(100) NOT NULL,
            note VARCHAR(100),
            status VARCHAR(25) NOT NULL
        )`;
        const queryDb = await this.connection.query(sqlQuery);
        // const results = Object.assign([{}], queryDb[0]);
    }


    async generateUserBalanceSheetTable(userId: number) {
        const sqlQuery: string = `
            CREATE TABLE IF NOT EXISTS user${userId}_bal_sheet (
            record_id INT PRIMARY KEY AUTO_INCREMENT,
            date VARCHAR(250) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            type VARCHAR(50) NOT NULL,
            description VARCHAR(100) NOT NULL,
            status VARCHAR(25) NOT NULL
        )`;
        const queryDb = await this.connection.query(sqlQuery);
        // const results = Object.assign([{}], queryDb[0]);
    };

    async generateUserChipsTable(userId: number) {
        const sqlQuery: string = `
            CREATE TABLE IF NOT EXISTS user${userId}_chips (
            id INT PRIMARY KEY AUTO_INCREMENT,
            kind VARCHAR(50) NOT NULL,
            chip VARCHAR(200) NOT NULL,
            status VARCHAR(25) NOT NULL
        )`;
        const queryDb = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], queryDb[0]);
        this.generateStarterChips(userId);
    };

    async generateStarterChips(userId: number): Promise<void> {
        const sqlQuery: string = `INSERT INTO user${userId}_chips (kind, chip, status) VALUES
        ('asset', 'cash', 'active'),
        ('asset', 'checking', 'active'),
        ('asset', 'savings', 'active'),
        ('asset', '401k', 'active'),
        ('asset', 'roth', 'active'),
        ('asset', 'fidelity', 'active'),
        ('asset', 'vanguard', 'active'),
        ('liability', 'mortgage', 'active'),
        ('liability', 'auto loan', 'active'),
        ('liability', 'visa', 'active'),
        ('liability', 'capital one', 'active'),
        ('expense_category', 'discretionary', 'active'),
        ('expense_category', 'groceries', 'active'),
        ('expense_category', 'transportation', 'active'),
        ('expense_category', 'eating out', 'active'),
        ('expense_category', 'recurring', 'active'),
        ('expense_vendor', 'amazon', 'active'),
        ('expense_vendor', 'harris teeter', 'active'),
        ('expense_vendor', 'trader joes', 'active'),
        ('expense_vendor', 'target', 'active'),
        ('expense_vendor', 'bp', 'active'),
        ('expense_vendor', 'mint mobile', 'active'),
        ('income_source', 'paycheck', 'active'),
        ('income_source', 'interest', 'active'),
        ('income_source', 'dividends', 'active'),
        ('income_source', 'random', 'active'),
        ('invest_institution', '401k - personal contribution', 'active'),
        ('invest_institution', '401k - employer contribution', 'active'),
        ('invest_institution', 'fidelity', 'active'),
        ('invest_institution', 'vanguard - brokerage', 'active'),
        ('invest_institution', 'vanguard - roth ira', 'active');
     `
        const queryDb = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], queryDb[0]);
    }

    async validateLoginCredentials(loginUserDto: LoginUserDto): Promise<number> {
        const sqlQuery: string = `SELECT id, password FROM users WHERE username='${loginUserDto.username}'`;
        const hashSaltPasswordFromDbQuery = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], hashSaltPasswordFromDbQuery[0]);
        const dbHashSaltPassword: string = `${results[0].password}`;
        const userId: number = results[0].id;
        const isMatch: boolean = await bcrypt.compare(loginUserDto.password, dbHashSaltPassword);
        if (!isMatch) {            
            return 0;
        } else {
            return userId;
        };
    };

    async getUserDataOnSuccessfulValidation(userId: number): Promise<UserLoginData> {
        const userBasicProfile: UserBasicProfile = await this.getUserBasicProfile(userId);
        const userIncome: IncomeDto[] = await this.getUserIncome(userBasicProfile.id);
        const userInvestments: InvestDto[] = await this.getUserInvestments(userBasicProfile.id);
        const userExpenses: ExpenseDto[] = await this.getUserExpenses(userBasicProfile.id);
        const userBalanceSheetEntries: BalanceRecordDto[] = await this.getUserBalanceSheetEntries(userBasicProfile.id);
        const userChips: ChipDto[] = await this.getUserChips(userBasicProfile.id);

        // mysql float values are stored strings and must therefore be transformed to numbers after retrieved for application use
        
        if (userIncome) {
            userIncome.map((income: IncomeDto) => income.amount = Number(income.amount));
        };
        if (userInvestments) {
            userInvestments.map((invest: InvestDto) => invest.amount = Number(invest.amount));
        };
        if (userExpenses) {
            userExpenses.map((expense: ExpenseDto) => expense.amount = Number(expense.amount));
        };
        if (userBalanceSheetEntries) {
            userBalanceSheetEntries.map((entry: BalanceRecordDto) => entry.amount = Number(entry.amount));
        };

        console.log(userInvestments);
        

        const userLoginData: UserLoginData = {
            basicProfile: userBasicProfile,
            income: userIncome,
            investments: userInvestments,
            expenses: userExpenses,
            balanceSheetEntries: userBalanceSheetEntries,
            chips: userChips
        };
        return userLoginData;
    };

    async getUserBasicProfile(userId: number): Promise<UserBasicProfile> {
        const sqlQuery: string = `SELECT id, username, email, join_date FROM users WHERE id='${userId}'`;
        const basicUserData = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], basicUserData[0]);
        return results[0];
    };

    async getUserIncome(userId: number): Promise<IncomeDto[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_income WHERE status != 'deactivated' ORDER BY date ASC;`;
        const userIncome = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userIncome[0]);
        return this.checkForReturnValues(results);
        // return this.incomeService.getActiveIncome(userId);
    };

    async getUserInvestments(userId: number): Promise<InvestDto[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_invest WHERE status != 'deactivated' ORDER BY date ASC;`;
        const userInvest = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userInvest[0]);
        return this.checkForReturnValues(results);
        // return this.incomeService.getActiveIncome(userId);
    };

    async getUserExpenses(userId: number): Promise<ExpenseDto[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_expenses WHERE status != 'deactivated' ORDER BY date ASC;`;
        const userExpenses = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userExpenses[0]);
        return this.checkForReturnValues(results);
    };

    async getUserBalanceSheetEntries(userId: number): Promise<BalanceRecordDto[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_bal_sheet WHERE status != 'deactivated' ORDER BY date ASC;`;
        const userBalanceSheetEntries = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userBalanceSheetEntries[0]);
        return this.checkForReturnValues(results);
    };

    async getUserChips(userId: number): Promise<ChipDto[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_chips ORDER BY chip ASC`;
        const userChips = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userChips[0]);
        return this.checkForReturnValues(results);
    };

    private checkForReturnValues(results: any): IncomeDto[] | ExpenseDto[] | BalanceRecordDto[] | ChipDto[] | null | any {
        // if no values return(if table is empty will still return length of 1, but of an object with no key/value pairs)
        if (Object.keys(results[0]).length === 0 && results.length === 1) {
            return null;
        } else {
            return results;
        };
    };
}

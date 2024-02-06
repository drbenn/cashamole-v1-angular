import { Injectable } from '@nestjs/common';
import { Connection } from 'mysql2';
import { InjectClient } from 'nest-mysql';
import { DashboardHistoryData, InsertUser, LoginUserDto, RegisterUserDto, UserBasicProfile, UserExist, UserLoginData } from './auth-dto/auth-dto';
import * as bcryptjs from 'bcryptjs';
import { IncomeDto } from 'src/income/income-dto/income-dto';
import { ExpenseDto } from 'src/expense/expense-dto/expense-dto';
import { BalanceRecordDto } from 'src/balance_sheet/balance_sheet-dto/balance_sheet-dto';
import { ChipDto } from 'src/chip/chip-dto/chip-dto';
import { InvestDto } from 'src/invest/invest-dto/invest-dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectClient() private readonly connection: Connection
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
        return await bcryptjs.hash(password, saltRounds, null);
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
        const isMatch: boolean = await bcryptjs.compare(loginUserDto.password, dbHashSaltPassword);
        if (!isMatch) {            
            return 0;
        } else {
            return userId;
        };
    };

    async getUserDataOnSuccessfulValidation(userId: number): Promise<UserLoginData> {
        const today = new Date();
        const thisMonth = today.getMonth() + 1;
        const thisYear = today.getFullYear();        
        const yearMonthString: string = `${thisYear}-${thisMonth}`;
        
        const userBasicProfile: UserBasicProfile = await this.getUserBasicProfile(userId);
        const userIncome: IncomeDto[] = await this.getUserIncome(userBasicProfile.id, yearMonthString);
        const userInvestments: InvestDto[] = await this.getUserInvestments(userBasicProfile.id, yearMonthString);
        const userExpenses: ExpenseDto[] = await this.getUserExpenses(userBasicProfile.id, yearMonthString);
        const userBalanceSheetEntries: BalanceRecordDto[] = await this.getUserBalanceSheetEntries(userBasicProfile.id, yearMonthString);
        const userChips: ChipDto[] = await this.getUserChips(userBasicProfile.id);
        const dashboardHistory: DashboardHistoryData = await this.getDashboardHistoryData(userBasicProfile.id);

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

        const userLoginData: UserLoginData = {
            basicProfile: userBasicProfile,
            income: userIncome,
            investments: userInvestments,
            expenses: userExpenses,
            balanceSheetEntries: userBalanceSheetEntries,
            chips: userChips,
            dashboardHistory: dashboardHistory
        };
        return userLoginData;
    };

    async getUserBasicProfile(userId: number): Promise<UserBasicProfile> {
        const sqlQuery: string = `SELECT id, username, email, join_date FROM users WHERE id='${userId}'`;      
        const basicUserData = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], basicUserData[0]);
        return results[0];
    };

    async getUserIncome(userId: number, yearMonthString: string): Promise<IncomeDto[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_income WHERE status != 'deactivated' AND date LIKE '${yearMonthString}%' ORDER BY date ASC;`;
        const userIncome = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userIncome[0]);
        return this.checkForReturnValues(results);
    };

    async getUserInvestments(userId: number, yearMonthString: string): Promise<InvestDto[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_invest WHERE status != 'deactivated' AND date LIKE '${yearMonthString}%' ORDER BY date ASC;`;
        const userInvest = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userInvest[0]);
        return this.checkForReturnValues(results);
    };

    async getUserExpenses(userId: number, yearMonthString: string): Promise<ExpenseDto[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_expenses WHERE status != 'deactivated' AND date LIKE '${yearMonthString}%' ORDER BY date ASC;`;
        const userExpenses = await this.connection.query(sqlQuery);
        const results = Object.assign([{}], userExpenses[0]);
        return this.checkForReturnValues(results);
    };

    async getUserBalanceSheetEntries(userId: number, yearMonthString: string): Promise<BalanceRecordDto[]> {
        const sqlQuery: string = `SELECT * FROM user${userId}_bal_sheet WHERE status != 'deactivated' AND date LIKE '${yearMonthString}%' ORDER BY date ASC;`;
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

    async getDashboardHistoryData(userId: number): Promise<DashboardHistoryData> {
        // const sqlQuery: string = `
            // SELECT LEFT(date, 7) AS unique_date, category, SUM(amount) AS total_expense
            // FROM user${userId}_expenses
            // GROUP BY LEFT(date, 7), category

        //     UNION ALL
            
            // SELECT LEFT(date, 7) AS unique_date, source, SUM(amount) AS total_income
            // FROM user${userId}_income
            // GROUP BY LEFT(date, 7), source
            
        //     UNION ALL
            
            // SELECT LEFT(date, 7) AS unique_date, institution, SUM(amount) AS total_invest
            // FROM user${userId}_invest
            // GROUP BY LEFT(date, 7), institution
        //     ;`;
        const expenseSqlQuery: string = `               
            SELECT LEFT(date, 7) AS unique_date, category, SUM(amount) AS total_expense
            FROM user${userId}_expenses
            GROUP BY LEFT(date, 7), category
        ;`;

        const incomeSqlQuery: string = `               
            SELECT LEFT(date, 7) AS unique_date, source, SUM(amount) AS total_income
            FROM user${userId}_income
            GROUP BY LEFT(date, 7), source
        ;`;

        const investSqlQuery: string = `               
            SELECT LEFT(date, 7) AS unique_date, institution, SUM(amount) AS total_invest
            FROM user${userId}_invest
            GROUP BY LEFT(date, 7), institution
        ;`;
        
        const balanceSqlQuery: string = `               
            SELECT LEFT(date, 7) AS unique_date, description, type , SUM(amount) AS total_balance
            FROM user${userId}_bal_sheet
            GROUP BY LEFT(date, 7), description, type
        ;`;
 
        const expense = await this.connection.query(expenseSqlQuery);
        const expenseResults = Object.assign([{}], expense[0]);
        const income = await this.connection.query(incomeSqlQuery);
        const incomeResults = Object.assign([{}], income[0]);
        const invest = await this.connection.query(investSqlQuery);
        const investResults = Object.assign([{}], invest[0]);
        const balances = await this.connection.query(balanceSqlQuery);
        const balanceResults = Object.assign([{}], balances[0]);
        const dashboardHistoryObject: DashboardHistoryData = this.dashboardHistoryToObject(expenseResults, incomeResults, investResults, balanceResults);
        return dashboardHistoryObject;
    };

    // Set results into organized json for ease of consumption and setting to state
    private dashboardHistoryToObject(expenseResults: any, incomeResults: any, investResults: any, balancesResults: any): DashboardHistoryData {
        const dashboardHistoryData: DashboardHistoryData = {
            expenses: [],
            income: [],
            investments: [],
            balances: []
        };

        if (expenseResults && expenseResults.length) {
            expenseResults.forEach((item: any) => {
                if (item.total_expense) {
                    dashboardHistoryData.expenses.push(item);
                };
            })
        };

        if (incomeResults && incomeResults.length) {
            incomeResults.forEach((item: any) => {
                if (item.total_income) {
                    dashboardHistoryData.income.push(item);
                };
            })
        };

        if (investResults && investResults.length) {
            investResults.forEach((item: any) => {
                if (item.total_invest) {
                    dashboardHistoryData.investments.push(item);
                };
            })
        };

        if (balancesResults && balancesResults.length) {
            balancesResults.forEach((item: any) => {
                if (item.total_balance) {
                    dashboardHistoryData.balances.push(item);
                };
            })
        };
        return dashboardHistoryData;
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

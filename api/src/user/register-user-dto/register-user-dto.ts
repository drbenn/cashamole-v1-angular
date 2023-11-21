export class RegisterUserDto {
    email: string;
    username: string;
    password: string;
}

export class InsertUser {
    insertSuccessful: boolean;
    username: string;
    email: string;
}

export class UserExist { 
    userExist: boolean;
    username: boolean;
    email: boolean;
}


export class LoginUserDto {
    username: string;
    password: string;
}
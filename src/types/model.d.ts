    interface IUser {
        _id: string;
        user_name: string;
        display_name: string;
        email?: string;
        first_name?: string;
        last_name?: string;
        avatarURL?: string | null;
        status?: 'online' | 'offline';
        lastSeen?: string;
    }

    interface IUserLogin {
        message: string;
        accessToken: string;
        user: IUser;
    }
    
    interface IRegister {}
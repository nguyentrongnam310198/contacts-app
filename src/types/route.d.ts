type RootStackParamList = {
    create_account: undefined,
    home: undefined,
    login: undefined,
    profile: undefined | {id: number, title: string};
    //truyền data: obj hoặc undefined (không truyền)
};

export default RootStackParamList;



type RootStackParamList = {
    create_account: undefined,
    home: undefined,
    Tab: undefined,
    login: undefined,
    addcontact: undefined | {id: number, title: string};
    detail: { user: any } | undefined;
    //truyền data: obj hoặc undefined (không truyền)
};

export default RootStackParamList;



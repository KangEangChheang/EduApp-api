interface detail {
    name: string;
    avatar: string;
}

export class ParticipantBuilder {
    private user: any = undefined;
    private detail: detail = undefined;

    addUser(user: any){
        this.user = user;
        return this;
    }

    addDetail(detail: detail){
        this.detail = detail;
        return this;
    }

    build(){
        return {
            user: this.user,
            detail: this.detail
        };
    }
}
    


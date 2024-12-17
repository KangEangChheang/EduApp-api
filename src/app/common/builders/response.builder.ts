export class ResponseBuilder {
    private message: string = undefined;
    private data: any = undefined;

    addMessage(message: string){
        this.message = message;
        return this;
    }

    addData(data: any){
        this.data = data;
        return this;
    }

    build(){
        return {
            message: this.message,
            data: this.data
        };
    }
}
    


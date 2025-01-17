export class PollBuilder {
    private question: string = undefined;
    private options: string[] = undefined;
    private type: string = undefined; // mutliple-choice or open answer or single-multiselect response

    constructor(question: string, type: string) {
        this.question = question;
        this.type = type;
    }

    setOptions(options: string[]) {
        this.options = options;
        return this;
    }

    build() {
        return {
            question: this.question,
            options: this.options,
            type: this.type
        }
    }
}
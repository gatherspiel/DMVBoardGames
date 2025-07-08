export class FormSelector {

    private formSelectors: Set<String>;

    constructor() {
        this.formSelectors = new Set<String>();
    }

    clearFormSelectors(){
        this.formSelectors = new Set<String>();
    }

    addFormSelector(formSelector: string){
        this.formSelectors.add(formSelector);
    }


}
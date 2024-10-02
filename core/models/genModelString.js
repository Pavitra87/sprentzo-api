export function genModelString(modelName){

    return `
    class ${modelName} extends Base${modelName}Model{
        constructor(d){
            super(d)
        }
    }

    export default ${modelName}
    `
}
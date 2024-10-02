export function genControllerString(modelName){

    return `
    class ${modelName}Controller extends Base${modelName}Controller{
        constructor(){
            super()
        }
    }
    export default ${modelName}Controller
    `
}
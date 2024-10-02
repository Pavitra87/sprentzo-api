export default function catchHandler(e){

    if(e.code === 11000)
    return "Duplicate entry"
    else 
    return "internal server error"
}
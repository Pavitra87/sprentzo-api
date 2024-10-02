import catchHandler from "../../errorHandlers/catchHandler.js";
export default async function registerHandler(app){
    app.post("/register", async (req, res) => {
        console.log(req.body)
         try{  const userData = {...req.body}
        const role = await Role.readAll({"title":"user"})
        console.log(role[0]._id)
        if(role.length <1) return res.status(500).send("default role is missing")
        userData.roles = [role[0]._id]
         const user =   new  User(userData)
         await user.save()
            res.send({user});
        }catch(e){
            res.status(500).send(catchHandler(e));
        }
      });
}
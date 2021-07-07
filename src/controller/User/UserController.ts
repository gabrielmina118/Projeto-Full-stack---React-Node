import { Request, Response } from "express";
import UserBussines from "../../bussines/User/UserBussines";
import { BaseDatabase } from "../../data/BaseDatabse";
import { LoginInputDTO, User, UserInputDTO } from "../../model/User";

class UserController {

    async signup(req: Request, res: Response) {
        try {
            const input: UserInputDTO = {
                name: req.body.name,
                email: req.body.email,
                nickname: req.body.nickname,
                password: req.body.password,
                role: User.stringToUserRole(req.body.role)
            }

            const token = await UserBussines.createUser(input)

            res.status(200).send({ token });
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }
    }

    async resetPass(req: Request, res: Response) {
        try {
            const email = req.body.email as string;
            
            const message = await UserBussines.resetPass(email)

            res.status(200).send({message})
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }
    }

    async feed(req: Request, res: Response) {
        try {
            const token = req.headers.authorization!;

            const feeds = await UserBussines.getFeed(token);
            res.status(200).send({ feeds })
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }
    }

    
    async feedAll(req: Request, res: Response) {
        try {
            const token = req.headers.authorization!;

            const allPersons = await UserBussines.getAllPerson(token);
            res.status(200).send({ allPersons })
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }
    }

    async login(req: Request, res: Response) {
        try {
            let email = "";
            let nickname = "";

            const emailOrNick = req.body.emailOrNick;

            if (!(emailOrNick.indexOf("@") === -1)) {
                email = emailOrNick;
            } else {
                nickname = emailOrNick;
            }


            const emailNick = (email || nickname) as string

            const input: LoginInputDTO = {
                emailNick,
                password: req.body.password
            }

            const token = await UserBussines.loginUser(input)

            res.status(200).send({ token });
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message });
        } finally {
            await BaseDatabase.destroyConnection();
        }
    }


}
export { UserController }
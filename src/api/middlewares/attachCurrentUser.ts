import { db } from "../../loaders/knex";

const attachCurrentUser = async (req, res, next) => {
  try {
    // check whether user exists with email
    const userRecord = await db("users")
      .where({
        id: req.token.id,
        email: req.token.email,
      })
      .first();

    if (!userRecord) {
      return res.sendStatus(401);
    }

    const currentUser = userRecord;
    Reflect.deleteProperty(currentUser, "password");
    req.currentUser = currentUser;
    return next();
  } catch (e) {
    console.log("🔥 Error attaching user to req: %o", e);
    return next(e);
  }
};

export default attachCurrentUser;

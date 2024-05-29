"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("../../loaders/knex");
const attachCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check whether user exists with email
        const userRecord = yield (0, knex_1.db)("users")
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
    }
    catch (e) {
        console.log("🔥 Error attaching user to req: %o", e);
        return next(e);
    }
});
exports.default = attachCurrentUser;
//# sourceMappingURL=attachCurrentUser.js.map
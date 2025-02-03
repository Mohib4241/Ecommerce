import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config/index";
import { postgreConnection } from "../utility/postgreConnection";
import {redis} from '../utility/Redis'
// import { string } from 'joi'

interface payload {
  id: number;
}

interface Token {
  rowCount: number;
  rows: object;
}

export const GenerateNewToken = async (id: number) => {
  const options: SignOptions = {
    algorithm: "HS512",
    expiresIn: "30min",
  };

  const payload: payload = {
    id: id,
  };

  const accessToken = jwt.sign(payload, config.key, options);
  const refreshToken = jwt.sign(payload, config.key, { expiresIn: "3d" });

  try {
    const TokenExist = await postgreConnection.query(
      "select * from session where uid = $1",[id]);

    if (TokenExist.rowCount === 0) {
      await redis.setex("Token : access", 20 , accessToken)
      console.log(await redis.get("Token : access"));
      await postgreConnection.query(
        "INSERT INTO SESSION ( REFRESH , UID ) VALUES  ( $1 ,  $2 ) on conflict do nothing",
        [ refreshToken, id]
      );
    } else {
      await redis.set("Token : access",accessToken)
       await postgreConnection.query(
        "update session set  refresh = $1 where uid = $2",
        [ refreshToken, id]
      );
      return { accessToken, refreshToken };
    }

    return { accessToken, refreshToken };
  } catch (error) {
    throw error
  }
};


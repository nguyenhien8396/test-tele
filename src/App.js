import React, { useState } from "react";
import "./styles.css";
import {
  sendCode as sc,
  signIn as si,
  checkPassword,
  getPassword
} from "./funcs";
const { MTProto, getSRPParams } = require("@mtproto/core");

export default function App() {
  const [api, setApi] = useState({
    id: "",
    hash: ""
  });

  const [info, setInfo] = useState({
    mobile: "",
    tfa: "",
    code: "",
    phone_code_hash: ""
  });

  const [step, setStep] = useState("sendCode");

  async function sendCode() {
    const { id, hash } = api;
    const apiid = parseInt(id);
    const mtproto = new MTProto({ apiid, hash });
    const { phone_code_hash } = await sc(mtproto, info.mobile);
    setInfo({ ...info, phone_code_hash: phone_code_hash });
    setStep("Verify");
  }

  async function signIn() {
    const { id, hash } = api;
    const mtproto = new MTProto({ id, hash });
    const { code, phone, phone_code_hash } = info;
    try {
      const authResult = await si(mtproto, {
        code,
        phone,
        phone_code_hash
      });

      console.log(`authResult:`, authResult);
    } catch (error) {
      console.log(error);
      if (error.error_message !== "SESSION_PASSWORD_NEEDED") {
        return;
      }

      // // 2FA

      // const { srp_id, current_algo, srp_B } = await getPassword();
      // const { g, p, salt1, salt2 } = current_algo;

      // const { A, M1 } = await getSRPParams({
      //   g,
      //   p,
      //   salt1,
      //   salt2,
      //   gB: srp_B,
      //   password,
      // });

      // const authResult = await checkPassword({ srp_id, A, M1 });

      // console.log(`authResult:`, authResult);
    }
  }

  return (
    <div className="App">
      {step === "sendCode" ? (
        <>
          <input
            name="api-id"
            type="text"
            placeholder="API ID"
            value={api.id}
            onChange={(e) => setApi({ ...api, id: e.target.value })}
          />
          <br />
          <br />
          <input
            name="api-hash"
            type="text"
            placeholder="HASH"
            value={api.hash}
            onChange={(e) => setApi({ ...api, hash: e.target.value })}
          />
          <br />
          <br />
          <input
            name="mobile"
            type="text"
            placeholder="Mobile"
            value={info.mobile}
            onChange={(e) => setInfo({ ...info, mobile: e.target.value })}
          />
          <br />
          <br />
          <button onClick={sendCode}>Send Code</button>
        </>
      ) : (
        <>
          <input
            name="mobile"
            type="text"
            placeholder="Mobile"
            value={info.code}
            onChange={(e) => setInfo({ ...info, code: e.target.value })}
          />
          <br />
          <br />
          <button onClick={signIn}>Log In</button>
        </>
      )}
    </div>
  );
}

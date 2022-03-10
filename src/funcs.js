export async function getUser(api) {
  try {
    const user = await api.call("users.getFullUser", {
      id: {
        _: "inputUserSelf"
      }
    });

    return user;
  } catch (error) {
    return null;
  }
}
export function sendCode(api, phone) {
  return api.call("auth.sendCode", {
    phone_number: phone,
    settings: {
      _: "codeSettings"
    }
  });
}
export function signIn(api, { code, phone, phone_code_hash }) {
  return api.call("auth.signIn", {
    phone_code: code,
    phone_number: phone,
    phone_code_hash: phone_code_hash
  });
}
export function getPassword(api) {
  return api.call("account.getPassword");
}

export function checkPassword(api, { srp_id, A, M1 }) {
  return api.call("auth.checkPassword", {
    password: {
      _: "inputCheckPasswordSRP",
      srp_id,
      A,
      M1
    }
  });
}

import authApi from "@/services/auth/auth.api";
import usersApi from "@/services/users/users.api";
import store from "@/store";
import { setCredentials } from "@/store/auth.slice";
import { setUser } from "@/store/users.slice";

export async function layoutLoader() {
  const auth = store.getState().auth;
  if (!auth.accessToken) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      store.dispatch(setCredentials({ accessToken }));
      const me = await store.dispatch(authApi.endpoints.me.initiate()).unwrap();
      const user = await store
        .dispatch(usersApi.endpoints.getUser.initiate({ id: me.id }))
        .unwrap();
      if (user) {
        store.dispatch(setUser(user));
      }
    }
  }
}

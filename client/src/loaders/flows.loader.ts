import flowsApi from "@/services/flows/flows.api";
import store from "@/store";

export async function flowsLoader() {
  return await store.dispatch(
    flowsApi.endpoints.getFlows.initiate({ page: 1 }),
  );
}

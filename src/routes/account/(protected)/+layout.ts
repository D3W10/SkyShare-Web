import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { account, loginStored } from "$lib/data/account.svelte";

export const load = async () => {
    if (browser && !account.loggedIn) {
        const loggedIn = await loginStored();
        if (!loggedIn)
            goto("/account/login");
    }
};
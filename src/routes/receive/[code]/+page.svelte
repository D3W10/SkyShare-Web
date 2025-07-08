<script lang="ts">
    import { onMount } from "svelte";
    import { twMerge } from "tailwind-merge";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { i18n } from "$lib/data/i18n.svelte";
    import { app } from "$lib/data/app.svelte";
    import { connection } from "$lib/data/connection.svelte";
    import { setLock, setUnlock } from "$lib/data/disable.svelte";
    import { setError } from "$lib/data/error.svelte";
    import { cleanup } from "$lib/data/cleanup.svelte";
    import PageLayout from "$lib/components/PageLayout.svelte";
    import Button from "$lib/components/Button.svelte";
    import Link from "$lib/components/Link.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import ProfilePicture from "$lib/components/ProfilePicture.svelte";
    import { WebRTC } from "$lib/models/WebRTC.class.svelte";
    import { boxStyles, fetchUser, transitions } from "$lib/utils";

    let connected = $state(false), ready = $state(false), code = $state("");
    let files = $state<File[]>([]), message = $state("");

    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        const checked = params.get("checked");
        code = page.params.code;

        setLock(true);

        if (checked === null || checked === "false") {
            const [error, data] = await app.apiCall<{ status: boolean }>("/transfer/" + code + "/check");
            if (error) {
                setUnlock();
                goto("/receive");
                return;
            }
            else if (!data.status) {
                setError("invalidCode");
                setUnlock();
                goto("/receive");
                return;
            }
        }

        connection.c = new WebRTC(await WebRTC.getCredentials());
        cleanup.push(() => connection.c?.disconnect());
        await connection.c.setUpAsReceiver(code);

        connection.c.setListener("dataOpen", () => connection.c?.sendIdentification());
        connection.c.setListener("fileOpen", () => ready = true);

        connection.c.setListener("end", () => {
            connection.c?.disconnect();
            setUnlock();
            setError("senderDisconnected");
            goto("/receive");
        });

        connection.c.setListener("data", raw => {
            const { type, data } = JSON.parse(raw);

            if (type === "details" && files.length === 0 && connection.c) {
                files = data.files;
                message = data.message;
                connection.c.details = data;

                fetchUser(connection.c, data.user);
                setUnlock();
                connected = true;
            }
        });
    });

    async function startReceive() {
        setLock();
        connection.c?.signalStart();
        goto("/receive/transfer");
    }
</script>

<PageLayout title={i18n.t("receive.review.title")}>
    {#if !connected}
        <p class="size-full flex justify-center items-center text-lg font-semibold" in:transitions.pageIn out:transitions.pageOut>{i18n.t("receive.review.obtainingInfo")}</p>
    {:else}
        <div class="size-full flex flex-col md:flex-row max-md:gap-y-6 md:gap-x-6" in:transitions.pageIn out:transitions.pageOut>
            <div class={twMerge(boxStyles.pane, "w-full h-96 md:w-64 md:h-full p-2 flex flex-col gap-y-2 rounded-2xl overflow-y-auto")}>
                {#each files as file (file.name)}
                    <div class={twMerge(boxStyles.box, "px-2 items-center")}>
                        <Icon name="file" class="h-6 aspect-square" />
                        <div class="ml-2 flex flex-col gap-y-0">
                            <p class="text-sm overflow-hidden break-words [display:-webkit-box] [word-break:break-all] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]" title={file.name}>{file.name}</p>
                            <p class="text-xs text-slate-500">{app.formatFileSize(file.size)}</p>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="h-full md:px-4 flex flex-col items-center flex-1">
                <div class="size-full">
                    <div class="flex gap-x-6">
                        <h3 class="font-semibold">{i18n.t("receive.review.sentBy")}</h3>
                        <div class="flex items-center gap-x-1.5">
                            <ProfilePicture picture={connection.c?.remotePeerData.picture} class="size-6" />
                            <p>{connection.c?.remotePeerData.username ? connection.c?.remotePeerData.username : i18n.t("send.waiting.anonymous")}</p>
                        </div>
                    </div>
                    <h3 class="mt-6 mb-2 font-semibold">{i18n.t("send.message")}</h3>
                    <div class={twMerge(boxStyles.pane, "h-32 py-1.5 overflow-y-auto", !message ? "flex justify-center items-center" : "")}>
                        {#if message}
                            <p class="h-fit">{message}</p>
                        {:else}
                            <p class="font-semibold text-slate-500">{i18n.t("receive.review.noMessage")}</p>
                        {/if}
                    </div>
                    <div class="mt-6 flex gap-x-4">
                        <div class="flex-1">
                            <h3 class="mb-2 font-semibold">{i18n.t("send.size")}</h3>
                            <div class={twMerge(boxStyles.pane, "py-1.5 grid text-sm *:col-[1] *:row-[1]")}>
                                <p>{app.formatFileSize(files.reduce((p, c) => p + c.size, 0))}</p>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h3 class="mb-2 font-semibold">{i18n.t("send.quantity")}</h3>
                            <div class={twMerge(boxStyles.pane, "py-1.5 grid text-sm *:col-[1] *:row-[1]")}>
                                <p>{files.length} {i18n.t("send.file", { count: files.length })}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-x-2">
                    <Button class="w-30" disabled={!ready} onclick={startReceive}>{i18n.t("receive.receive")}</Button>
                    <Link class="hidden md:block" type="secondary" href="skyshare://receive/code?code={code}" target="_self">{i18n.t("receive.receiveInApp")}</Link>
                </div>
            </div>
        </div>
    {/if}
</PageLayout>
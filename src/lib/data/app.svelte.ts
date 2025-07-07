import { info } from "./info.svelte";
import { setError } from "./error.svelte";
import type { ErrorT } from "$lib/models/ErrorT.type";
import type { ApiResult } from "$lib/models/ApiResult.interface";

const units = ["Bytes", "KB", "MB", "GB"];

export const app = $state({
    showOpenDialog: async (): Promise<FileList | null> => {
        return new Promise(resolve => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = true;
            input.style.display = "none";
            document.body.appendChild(input);
    
            input.addEventListener("change", () => {
                resolve(input.files);
                document.body.removeChild(input);
            });
    
            input.click();
        });
    },
    apiCall: async <T>(endpoint: string, { method = "GET", params, headers, body }: { method?: string, params?: string, headers?: HeadersInit, body?: object } = {}, error = true): Promise<["", T] | [ErrorT, null]> => {
        try {
            if (!navigator.onLine) {
                setError("offline");
                return ["offline", null];
            }

            console.log("[API] " + endpoint + (params ? "?" + params : ""));

            const sendHeaders: HeadersInit = { "Content-Type": "application/json" };
            if (body && headers) {
                Object.assign(sendHeaders, headers);
                headers = sendHeaders;
            }

            const apiResult = await fetch(info.api + endpoint + (params ? "?" + params : ""), {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });

            const json = await apiResult.json() as ApiResult<T>;
            if (json.code !== "success" || !json.data) {
                console.error("[API] Return error: " + json.code);
                if (error)
                    setError("unknown");

                return ["unknown", null];
            }

            return ["", json.data];
        }
        catch (err) {
            console.error(err instanceof Error ? err.message : err);
            if (error)
                setError("unknown");

            return ["unknown", null];
        }
    },
    authCall: async (endpoint: string, { method = "GET", params, headers, body }: { method?: string, params?: string, headers?: HeadersInit, body?: object } = {}): Promise<[boolean, any]> => {
        try {
            console.log("[AUTH] " + endpoint + (params ? "?" + params : ""));
    
            const authResult = await fetch(info.auth + endpoint + (params ? "?" + params : ""), {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            }), json = await authResult.json();
    
            return [json.status !== "ok", json];
        }
        catch (err) {
            console.error(err instanceof Error ? err.message : err);
    
            return [true, null];
        }
    },
    formatFileSize: (size: number, decimals = 2) => {
        let count = 0;
    
        do {
            size /= 1024;
            count++;
        }
        while (size > 1024);
    
        return size.toFixed(decimals) + " " + units[count];
    },
    formatTime: (seconds: number, [hStr, mStr, sStr] = ["hours", "minutes", "seconds"]) => {
        seconds = Math.max(0, Math.floor(seconds));
    
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
    
        if (h > 0)
            return `${h} ${hStr}`;
        else if (m > 0)
            return `${m} ${mStr}`;
        else
            return `${s} ${sStr}`;
    },
    saveCredentials: (refreshToken: string) => {
        localStorage.setItem("refreshToken", refreshToken);
    },
    logout: () => {
        localStorage.removeItem("refreshToken");
    }
});
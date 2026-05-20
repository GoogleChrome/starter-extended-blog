import { n as e, t } from "../chunks/defaults-DMD-8IKq.js";
import { CreateMLCEngine as n, prebuiltAppConfig as r } from "@mlc-ai/web-llm";
//#region backends/webllm.js
var i = class extends e {
	#e;
	#t;
	#n = 0;
	constructor(e = {}) {
		super(e.modelName || t.webllm.modelName);
	}
	async #r(e) {
		if (!this.#e) {
			let t = (t) => {
				if (!e) return;
				let n = 1 / 65536, r = Math.floor(t / n) * n;
				r <= e.__lastProgressLoaded || (e.dispatchEvent(new ProgressEvent("downloadprogress", {
					loaded: r,
					total: 1,
					lengthComputable: !0
				})), e.__lastProgressLoaded = r);
			};
			t(0);
			let i = {
				...r,
				cacheBackend: "cross-origin"
			};
			this.#e = await n(this.modelName, {
				appConfig: i,
				initProgressCallback: (e) => {
					t(e.progress);
				}
			}), t(1);
		}
		return this.#e;
	}
	static availability(e) {
		if (e?.expectedInputs && Array.isArray(e.expectedInputs)) {
			for (let t of e.expectedInputs) if (t.type === "audio" || t.type === "image") return "unavailable";
		}
		return "available";
	}
	async createSession(e, t, n) {
		return await this.#r(n), this.generationConfig = { max_tokens: 512 }, this.#t = t.systemInstruction, this.responseSchema = t.generationConfig?.responseSchema, this.#e;
	}
	async generateContent(e) {
		let t = await this.#r(), n = {
			messages: this.#i(e),
			...this.generationConfig
		};
		this.responseSchema && (n.response_format = {
			type: "json_object",
			schema: JSON.stringify(this.responseSchema)
		});
		let r = await t.chat.completions.create(n), i = r.choices[0].message.content;
		return this.#n += (r.usage?.prompt_tokens ?? 0) + (r.usage?.completion_tokens ?? 0), {
			text: i,
			usage: this.#n
		};
	}
	async generateContentStream(e) {
		let t = await this.#r(), n = {
			messages: this.#i(e),
			...this.generationConfig,
			stream: !0,
			stream_options: { include_usage: !0 }
		};
		this.responseSchema && (n.response_format = {
			type: "json_object",
			schema: JSON.stringify(this.responseSchema)
		});
		let r = await t.chat.completions.create(n), i = this;
		return (async function* () {
			let e = null;
			for await (let t of r) {
				let n = t.choices[0]?.delta?.content ?? "";
				n && (yield {
					text: () => n,
					usageMetadata: { totalTokenCount: 0 }
				}), t.usage && (e = t.usage);
			}
			i.#n += (e?.prompt_tokens ?? 0) + (e?.completion_tokens ?? 0), yield {
				text: () => "",
				usageMetadata: { totalTokenCount: i.#n }
			};
		})();
	}
	async countTokens(e) {
		let t = "";
		for (let n of e ?? []) for (let e of n?.parts ?? []) t += e.text ?? "";
		return Math.ceil(t.length / 4);
	}
	#i(e) {
		let t = e.map((e) => ({
			role: e.role === "model" ? "assistant" : e.role === "system" ? "system" : "user",
			content: e.parts.map((e) => e.text).join("")
		}));
		return this.#t && !t.some((e) => e.role === "system") && t.unshift({
			role: "system",
			content: this.#t
		}), this.responseSchema && (t.length > 0 && t[0].role === "system" ? t[0].content += "\n\nRespond with valid JSON." : t.unshift({
			role: "system",
			content: "Respond with valid JSON."
		})), t;
	}
};
//#endregion
export { i as default };

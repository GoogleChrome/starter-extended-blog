//#region semantic-embedder-api-polyfill.js
var e = "onnx-community/embeddinggemma-300m-ONNX", t = {
	"semantic-similarity": "task: sentence similarity | query: ",
	"retrieval-query": "task: search result | query: ",
	"retrieval-document": "title: none | text: ",
	classification: "task: classification | query: ",
	clustering: "task: clustering | query: "
}, n = new Set(Object.keys(t)), r = /* @__PURE__ */ new Set(), i = null;
async function a() {
	return i || (i = await import("@huggingface/transformers"), i.env.experimental_useCrossOriginStorage = !0), i;
}
function o(e, n) {
	let r = n ? t[n] : void 0;
	return r ? `${r}${e}` : e;
}
async function s(e, t) {
	try {
		let { ModelRegistry: n } = await a(), r = (await n.is_cached_files(e, {
			dtype: t,
			include_processor: !1
		})).files.filter((e) => e.file !== "generation_config.json");
		return r.length > 0 && r.every((e) => e.cached);
	} catch {
		return !1;
	}
}
var c = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope;
function l() {
	let e = import.meta.url;
	try {
		if (typeof globalThis < "u" && globalThis.location && new URL(e).origin !== globalThis.location.origin) {
			let t = `import ${JSON.stringify(e)};`, n = new Blob([t], { type: "application/javascript" });
			return URL.createObjectURL(n);
		}
	} catch {}
	return e;
}
function u(e, t = {}) {
	let n = l(), r = new Worker(n, { type: "module" });
	return new Promise((i, a) => {
		r.onmessage = (e) => {
			let { type: t, result: o, error: s } = e.data;
			t === "response" ? (i(o), r.terminate(), n.startsWith("blob:") && URL.revokeObjectURL(n)) : t === "error" && (a(Error(s)), r.terminate(), n.startsWith("blob:") && URL.revokeObjectURL(n));
		}, r.onerror = (e) => {
			a(e), r.terminate(), n.startsWith("blob:") && URL.revokeObjectURL(n);
		}, r.postMessage({
			action: e,
			payload: t
		});
	});
}
if (c) {
	let e = /* @__PURE__ */ new Set(), t = null, n = null, r = async (e, r, i) => {
		let { AutoModel: o, AutoTokenizer: s } = await a(), c = null;
		i && (c = (e) => {
			e.status === "progress_total" && self.postMessage({
				type: "progress",
				loaded: e.total > 0 ? e.loaded / e.total : 0
			});
		}), [t, n] = await Promise.all([s.from_pretrained(e, { progress_callback: c }), o.from_pretrained(e, {
			dtype: r,
			progress_callback: c
		})]);
	}, i = async (e, t) => typeof WebAssembly > "u" ? "unavailable" : await s(e, t) ? "available" : "downloadable";
	self.onmessage = async (a) => {
		let s = a.data;
		if (s.action === "availability") {
			try {
				let { modelId: e, dtype: t } = s.payload, n = await i(e, t);
				self.postMessage({
					type: "response",
					result: n
				});
			} catch (e) {
				self.postMessage({
					type: "error",
					error: e.message
				});
			}
			return;
		}
		if (s.type === "init") try {
			await r(s.modelId, s.dtype, s.hasMonitor), self.postMessage({ type: "ready" });
		} catch (e) {
			self.postMessage({
				type: "init-error",
				error: e.message,
				name: e.name || "Error"
			});
		}
		else if (s.type === "embed") {
			let { requestId: r, inputs: i, options: a } = s;
			try {
				if (!n || !t) throw Error("Model is not initialized in the worker.");
				let s = i.map((e) => o(e, a.taskType)), c = await t(s, {
					padding: !0,
					truncation: !0,
					max_length: 2048
				});
				if (e.has(r)) throw e.delete(r), new DOMException("Aborted", "AbortError");
				let { sentence_embedding: l } = await n(c);
				if (e.has(r)) throw e.delete(r), new DOMException("Aborted", "AbortError");
				let u = l.dims[1], d = l.data, f = { embeddings: i.map((e, t) => ({ values: d.slice(t * u, (t + 1) * u) })) };
				self.postMessage({
					type: "embed-response",
					requestId: r,
					result: f
				});
			} catch (t) {
				e.delete(r), self.postMessage({
					type: "embed-error",
					requestId: r,
					error: t.message,
					name: t.name || "Error"
				});
			}
		} else s.type === "abort-embed" && e.add(s.requestId);
	};
}
var d = class {
	#e = null;
	#t = !1;
	#n = null;
	#r = /* @__PURE__ */ new Map();
	#i = 0;
	constructor(e) {
		this.#e = e, this.#e.onmessage = (e) => {
			if (this.#t) return;
			let t = e.data;
			if (t.type === "embed-response") {
				let e = this.#r.get(t.requestId);
				e && (this.#r.delete(t.requestId), e.resolve(t.result));
			} else if (t.type === "embed-error") {
				let e = this.#r.get(t.requestId);
				if (e) {
					this.#r.delete(t.requestId);
					let n = globalThis[t.name] || DOMException || Error;
					e.reject(new n(t.error, t.name));
				}
			}
		}, this.#e.onerror = (e) => {
			if (this.#t) return;
			let t = /* @__PURE__ */ Error("Web Worker error: " + e.message);
			for (let e of this.#r.values()) e.reject(t);
			this.#r.clear(), this.destroy(t);
		};
	}
	static _checkContext() {
		let e = this.__window || (typeof globalThis < "u" ? globalThis : null), t = !1;
		try {
			(!e || e.closed || e.document && e.document.defaultView !== e) && (t = !0);
		} catch {
			t = !0;
		}
		if (t) {
			let t;
			try {
				t = e?.DOMException || globalThis.DOMException || Error;
			} catch {
				t = globalThis.DOMException || Error;
			}
			throw new t("The execution context is not valid.", "InvalidStateError");
		}
	}
	_checkContext() {
		this.constructor._checkContext();
	}
	static availability() {
		let t = (async () => {
			if (this._checkContext(), typeof WebAssembly > "u") return "unavailable";
			let t = e;
			return r.has(t) ? "downloading" : await u("availability", {
				modelId: t,
				dtype: "q8"
			});
		})();
		return t.catch(() => {}), t;
	}
	static create(e = {}) {
		let t = this._createInternal(e);
		return t.catch(() => {}), t;
	}
	static async _createInternal(t = {}) {
		if (this._checkContext(), t.signal?.aborted) throw t.signal.reason || new DOMException("Aborted", "AbortError");
		let n = t.model || e, i = t.dtype || "q8", a = null;
		if (t.monitor) {
			let e = new EventTarget();
			t.monitor(e), a = (t) => {
				e.dispatchEvent(new ProgressEvent("downloadprogress", {
					loaded: t,
					total: 1,
					lengthComputable: !0
				}));
			};
		}
		a?.(0), r.add(n);
		let o = l(), s = new Worker(o, { type: "module" }), c = null, u = new Promise((e, t) => {
			let n = (n) => {
				let r = n.data;
				r.type === "progress" ? a?.(r.loaded) : r.type === "ready" ? (o.startsWith("blob:") && URL.revokeObjectURL(o), e()) : r.type === "init-error" && (o.startsWith("blob:") && URL.revokeObjectURL(o), t(new (globalThis[r.name] || DOMException || Error)(r.error, r.name)));
			}, r = (e) => {
				o.startsWith("blob:") && URL.revokeObjectURL(o), t(e);
			};
			s.addEventListener("message", n), s.addEventListener("error", r), c = () => {
				s.removeEventListener("message", n), s.removeEventListener("error", r);
			};
		}), d = null;
		t.signal && (d = () => {
			c?.(), s.terminate(), o.startsWith("blob:") && URL.revokeObjectURL(o), r.delete(n);
		}, t.signal.addEventListener("abort", d, { once: !0 }));
		try {
			s.postMessage({
				type: "init",
				modelId: n,
				dtype: i,
				hasMonitor: !!t.monitor
			}), await u;
		} catch (e) {
			throw s.terminate(), e;
		} finally {
			c?.(), t.signal && d && t.signal.removeEventListener("abort", d), r.delete(n);
		}
		a?.(1);
		let f = new this(s);
		return t.signal && t.signal.addEventListener("abort", () => {
			f.destroy(t.signal.reason);
		}, { once: !0 }), f;
	}
	embed(e, t = {}) {
		if (this.#t) {
			let e = Promise.reject(this.#n || new DOMException("The embedder has been destroyed.", "AbortError"));
			return e.catch(() => {}), e;
		}
		let n = this.#a(e, t);
		return n.catch(() => {}), n;
	}
	async #a(e, t = {}) {
		this._checkContext();
		let r = t.signal;
		if (r?.aborted) throw r.reason || new DOMException("Aborted", "AbortError");
		if (t.taskType !== void 0 && !n.has(t.taskType)) throw TypeError(`Failed to execute 'embed': The provided value '${t.taskType}' is not a valid enum value of type EmbedderTaskType.`);
		let i = Array.isArray(e) ? e : [e];
		if (i.length === 0) return { embeddings: [] };
		let a = ++this.#i;
		return new Promise((e, n) => {
			let o = null;
			r && (o = () => {
				this.#r.delete(a), this.#e?.postMessage({
					type: "abort-embed",
					requestId: a
				}), n(r.reason || new DOMException("Aborted", "AbortError"));
			}, r.addEventListener("abort", o, { once: !0 })), this.#r.set(a, {
				resolve: (t) => {
					o && r.removeEventListener("abort", o), e(t);
				},
				reject: (e) => {
					o && r.removeEventListener("abort", o), n(e);
				}
			}), this.#e?.postMessage({
				type: "embed",
				requestId: a,
				inputs: i,
				options: { taskType: t.taskType }
			});
		});
	}
	destroy(e) {
		if (this.#t) return;
		this.#t = !0, this.#n = e || new DOMException("The embedder has been destroyed.", "AbortError");
		let t = this.#n;
		for (let e of this.#r.values()) e.reject(t);
		this.#r.clear(), this.#e?.terminate(), this.#e = null;
	}
};
if (typeof globalThis < "u" && globalThis.document) {
	let e = "SemanticEmbedder", t = !!globalThis.__FORCE_SEMANTIC_EMBEDDER_POLYFILL__, n = (n) => {
		try {
			if (!n || n[e] && n[e].__isPolyfill) return;
			if (!(e in n) || t) {
				let t = { [e]: class extends d {} }[e];
				t.prototype[Symbol.toStringTag] = e, t.__window = n, t.__isPolyfill = !0, t.create = t.create.bind(t), t.availability = t.availability.bind(t), Object.defineProperty(n, e, {
					value: t,
					writable: !0,
					configurable: !0,
					enumerable: !1
				});
			}
		} catch {}
	};
	if (n(globalThis), typeof HTMLIFrameElement < "u") try {
		let e = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentWindow");
		e?.get && Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
			get() {
				let t = e.get.call(this);
				return t && n(t), t;
			},
			configurable: !0
		});
	} catch {}
	let r = new MutationObserver((e) => {
		for (let t of e) for (let e of t.addedNodes) e.tagName === "IFRAME" && (n(e.contentWindow), e.addEventListener("load", () => n(e.contentWindow), { once: !1 }));
	});
	globalThis.document?.documentElement && (r.observe(globalThis.document.documentElement, {
		childList: !0,
		subtree: !0
	}), globalThis.document.querySelectorAll("iframe").forEach((e) => {
		n(e.contentWindow), e.addEventListener("load", () => n(e.contentWindow), { once: !1 });
	})), globalThis[e]?.__isPolyfill && console.log(`Polyfill: window.${e} is now backed by the ${e} API polyfill.`);
}
//#endregion
export { d as SemanticEmbedder };

//#region semantic-embedder-api-polyfill.js
var e = "onnx-community/embeddinggemma-300m-ONNX", t = "q8", n = 2048, r = {
	query: "task: search result | query: ",
	document: "title: none | text: ",
	classification: "task: classification | text: "
}, i = /* @__PURE__ */ new Set(), a = null;
async function o() {
	return a || (a = await import("@huggingface/transformers"), a.env.experimental_useCrossOriginStorage = !0), a;
}
function s(e, t) {
	return `${r[t] ?? r.document}${e}`;
}
async function c(e, t) {
	try {
		let { ModelRegistry: n } = await o(), r = (await n.is_cached_files(e, {
			dtype: t,
			include_processor: !1
		})).files.filter((e) => e.file !== "generation_config.json");
		return r.length > 0 && r.every((e) => e.cached);
	} catch {
		return !1;
	}
}
var l = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope;
function u() {
	let e = import.meta.url;
	try {
		if (typeof globalThis < "u" && globalThis.location && new URL(e).origin !== globalThis.location.origin) {
			let t = `import ${JSON.stringify(e)};`, n = new Blob([t], { type: "application/javascript" });
			return URL.createObjectURL(n);
		}
	} catch {}
	return e;
}
function d(e, t = {}) {
	let n = u(), r = new Worker(n, { type: "module" });
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
if (l) {
	let e = /* @__PURE__ */ new Set(), t = null, r = null, i = null, a = async (e, n, a) => {
		let { AutoModel: s, AutoTokenizer: c } = await o(), l = null;
		a && (l = (e) => {
			e.status === "progress_total" && self.postMessage({
				type: "progress",
				loaded: e.total > 0 ? e.loaded / e.total : 0
			});
		}), [t, r] = await Promise.all([c.from_pretrained(e, { progress_callback: l }), s.from_pretrained(e, {
			dtype: n,
			progress_callback: l
		})]), i = e;
	}, l = async (e, t) => typeof WebAssembly > "u" ? "unavailable" : await c(e, t) ? "available" : "downloadable";
	self.onmessage = async (o) => {
		let c = o.data;
		if (c.action === "availability") {
			try {
				let { modelId: e, dtype: t } = c.payload, n = await l(e, t);
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
		if (c.type === "init") try {
			await a(c.modelId, c.dtype, c.hasMonitor), self.postMessage({ type: "ready" });
		} catch (e) {
			self.postMessage({
				type: "init-error",
				error: e.message,
				name: e.name || "Error"
			});
		}
		else if (c.type === "embed") {
			let { requestId: a, inputs: o, options: l } = c;
			try {
				if (!r || !t) throw Error("Model is not initialized in the worker.");
				let c = l.taskType ?? "document", u = o.map((e) => s(e, c)), d = await t(u, {
					padding: !0,
					truncation: !0,
					max_length: n
				});
				if (e.has(a)) throw e.delete(a), new DOMException("Aborted", "AbortError");
				let { sentence_embedding: f } = await r(d);
				if (e.has(a)) throw e.delete(a), new DOMException("Aborted", "AbortError");
				let p = f.dims[1], m = f.data, h = [];
				if (d.attention_mask) {
					let e = d.attention_mask.data, t = d.attention_mask.dims[1];
					for (let n = 0; n < o.length; n++) {
						let r = 0, i = n * t, a = i + t;
						for (let t = i; t < a; t++) Number(e[t]) === 1 && r++;
						h.push(r);
					}
				} else {
					let e = d.input_ids.dims[1];
					for (let t = 0; t < o.length; t++) h.push(e);
				}
				let g = {
					embeddings: o.map((e, t) => ({
						values: m.slice(t * p, (t + 1) * p),
						statistics: { tokenCount: h[t] }
					})),
					metadata: {
						embeddingSpace: i,
						maxInputTokens: n
					}
				};
				self.postMessage({
					type: "embed-response",
					requestId: a,
					result: g
				});
			} catch (t) {
				e.delete(a), self.postMessage({
					type: "embed-error",
					requestId: a,
					error: t.message,
					name: t.name || "Error"
				});
			}
		} else c.type === "abort-embed" && e.add(c.requestId);
	};
}
var f = class {
	#e = null;
	#t = e;
	#n = !1;
	#r = null;
	#i = /* @__PURE__ */ new Map();
	#a = 0;
	constructor(e, t) {
		this.#e = e, this.#t = t, this.#e.onmessage = (e) => {
			if (this.#n) return;
			let t = e.data;
			if (t.type === "embed-response") {
				let e = this.#i.get(t.requestId);
				e && (this.#i.delete(t.requestId), e.resolve(t.result));
			} else if (t.type === "embed-error") {
				let e = this.#i.get(t.requestId);
				if (e) {
					this.#i.delete(t.requestId);
					let n = globalThis[t.name] || DOMException || Error;
					e.reject(new n(t.error, t.name));
				}
			}
		}, this.#e.onerror = (e) => {
			if (this.#n) return;
			let t = /* @__PURE__ */ Error("Web Worker error: " + e.message);
			for (let e of this.#i.values()) e.reject(t);
			this.#i.clear(), this.destroy(t);
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
		let n = (async () => {
			if (this._checkContext(), typeof WebAssembly > "u") return "unavailable";
			let n = e;
			return i.has(n) ? "downloading" : await d("availability", {
				modelId: n,
				dtype: t
			});
		})();
		return n.catch(() => {}), n;
	}
	static create(e = {}) {
		let t = this._createInternal(e);
		return t.catch(() => {}), t;
	}
	static async _createInternal(n = {}) {
		if (this._checkContext(), n.signal?.aborted) throw n.signal.reason || new DOMException("Aborted", "AbortError");
		let r = n.model || e, a = n.dtype || t, o = null;
		if (n.monitor) {
			let e = new EventTarget();
			n.monitor(e), o = (t) => {
				e.dispatchEvent(new ProgressEvent("downloadprogress", {
					loaded: t,
					total: 1,
					lengthComputable: !0
				}));
			};
		}
		o?.(0), i.add(r);
		let s = u(), c = new Worker(s, { type: "module" }), l = null, d = new Promise((e, t) => {
			let n = (n) => {
				let r = n.data;
				r.type === "progress" ? o?.(r.loaded) : r.type === "ready" ? (s.startsWith("blob:") && URL.revokeObjectURL(s), e()) : r.type === "init-error" && (s.startsWith("blob:") && URL.revokeObjectURL(s), t(new (globalThis[r.name] || DOMException || Error)(r.error, r.name)));
			}, r = (e) => {
				s.startsWith("blob:") && URL.revokeObjectURL(s), t(e);
			};
			c.addEventListener("message", n), c.addEventListener("error", r), l = () => {
				c.removeEventListener("message", n), c.removeEventListener("error", r);
			};
		}), f = null;
		n.signal && (f = () => {
			l?.(), c.terminate(), s.startsWith("blob:") && URL.revokeObjectURL(s), i.delete(r);
		}, n.signal.addEventListener("abort", f, { once: !0 }));
		try {
			c.postMessage({
				type: "init",
				modelId: r,
				dtype: a,
				hasMonitor: !!n.monitor
			}), await d;
		} catch (e) {
			throw c.terminate(), e;
		} finally {
			l?.(), n.signal && f && n.signal.removeEventListener("abort", f), i.delete(r);
		}
		o?.(1);
		let p = new this(c, r);
		return n.signal && n.signal.addEventListener("abort", () => {
			p.destroy(n.signal.reason);
		}, { once: !0 }), p;
	}
	embed(e, t = {}) {
		if (this.#n) {
			let e = Promise.reject(this.#r || new DOMException("The embedder has been destroyed.", "AbortError"));
			return e.catch(() => {}), e;
		}
		let n = this.#o(e, t);
		return n.catch(() => {}), n;
	}
	async #o(e, t = {}) {
		this._checkContext();
		let r = t.signal;
		if (r?.aborted) throw r.reason || new DOMException("Aborted", "AbortError");
		let i = Array.isArray(e) ? e : [e];
		if (i.length === 0) return {
			embeddings: [],
			metadata: {
				embeddingSpace: this.#t,
				maxInputTokens: n
			}
		};
		let a = ++this.#a;
		return new Promise((e, n) => {
			let o = null;
			r && (o = () => {
				this.#i.delete(a), this.#e?.postMessage({
					type: "abort-embed",
					requestId: a
				}), n(r.reason || new DOMException("Aborted", "AbortError"));
			}, r.addEventListener("abort", o, { once: !0 })), this.#i.set(a, {
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
				options: { taskType: t.taskType ?? "document" }
			});
		});
	}
	static cosineSimilarity(e, t) {
		if (e.length !== t.length) throw RangeError("Embedding vectors must have the same dimension.");
		let n = 0, r = 0, i = 0;
		for (let a = 0; a < e.length; a++) n += e[a] * t[a], r += e[a] * e[a], i += t[a] * t[a];
		return r === 0 || i === 0 ? 0 : n / (Math.sqrt(r) * Math.sqrt(i));
	}
	get inputQuota() {
		return n;
	}
	destroy(e) {
		if (this.#n) return;
		this.#n = !0, this.#r = e || new DOMException("The embedder has been destroyed.", "AbortError");
		let t = this.#r;
		for (let e of this.#i.values()) e.reject(t);
		this.#i.clear(), this.#e?.terminate(), this.#e = null;
	}
};
if (typeof globalThis < "u" && globalThis.document) {
	let e = "SemanticEmbedder", t = !!globalThis.__FORCE_SEMANTIC_EMBEDDER_POLYFILL__, n = (n) => {
		try {
			if (!n || n[e] && !n[e].__isPolyfill) return;
			if (!(e in n) || t) {
				let t = { [e]: class extends f {} }[e];
				t.prototype[Symbol.toStringTag] = e, t.__window = n, t.__isPolyfill = !0, t.create = t.create.bind(t), t.availability = t.availability.bind(t), n[e] = t;
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
export { f as SemanticEmbedder };

//#region backends/base.js
var e = class {
	constructor(e) {
		this.modelName = e;
	}
	static availability(e) {
		return "available";
	}
	createSession(e, t, n) {
		throw Error("Not implemented");
	}
	async generateContent(e) {
		throw Error("Not implemented");
	}
	async generateContentStream(e) {
		throw Error("Not implemented");
	}
	async countTokens(e) {
		throw Error("Not implemented");
	}
	convertSchema(e) {
		return e;
	}
}, t = {
	firebase: { modelName: "gemini-3.1-flash-lite" },
	gemini: { modelName: "gemini-flash-lite-latest" },
	openai: { modelName: "gpt-4o" },
	transformers: {
		modelName: "onnx-community/gemma-3-1b-it-ONNX-GQA",
		device: "webgpu",
		dtype: "q4f16"
	},
	webllm: { modelName: "Llama-3.2-3B-Instruct-q4f32_1-MLC" }
};
//#endregion
export { e as n, t };

export function isWebGPUSupported() {
  return ((typeof window !== 'undefined') ||
    (typeof WorkerGlobalScope !== 'undefined')) &&
    !!navigator.gpu;
}
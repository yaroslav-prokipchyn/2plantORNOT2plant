export function noHoverSupport() {
  return !('ontouchstart' in window || navigator.maxTouchPoints > 0);
}
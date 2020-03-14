import { VNode, VNodeDirective } from 'vue'
import { consoleWarn } from '../../util/console'

function isCssColor (color?: string | false): boolean {
  return !!color && !!color.match(/^(#|var\(--|(rgb|hsl)a?\()/)
}

function setBackgroundColor (el: HTMLElement, color?: string | false): VNodeData {
  if (isCssColor(color)) {
    el.style.backgroundColor = `${color}`
    el.style.borderColor = `${color}`
  } else if (color) {
    el.classList.add(color)
  }
}

function setTextColor (el: HTMLElement, color?: string | false): VNodeData {
  if (isCssColor(color)) {
    el.style.color = `${color}`
    el.style.caretColor = `${color}`
  } else if (color) {
    const [colorName, colorModifier] = color.toString().trim().split(' ', 2) as (string | undefined)[]
    el.classList.add(`${colorName}--text`)
    if (colorModifier) {
      el.classList.add(`text--${colorModifier}`)
    }
  }
}

function setBorderColor (el: HTMLElement, color?: string | false): VNodeData {
  if (isCssColor(color)) {
    el.style.borderColor = `${color}`
  } else if (color) {
    const [colorName, colorModifier] = color.toString().trim().split(' ', 2) as (string | undefined)[]
    el.classList.add(`${colorName}--border`)
    if (colorModifier) {
      el.classList.add(`border--${colorModifier}`)
    }
  }
}

function updateColor (el: HTMLElement, binding: VNodeDirective) {
  if (binding.arg === 'background') setBackgroundColor(el, binding.value)
  else if (binding.arg === 'text') setTextColor(el, binding.value)
  else if (binding.arg === 'border') setBorderColor(el, binding.value)
}

function directive (el: HTMLElement, binding: VNodeDirective, node: VNode) {
  updateColor(el, binding)
}

function unbind (el: HTMLElement) {

}

function update (el: HTMLElement, binding: VNodeDirective) {
  if (binding.value === binding.oldValue) {
    return
  }

  updateColor(el, binding)
}

export const Colorable = {
  bind: directive,
  unbind,
  update,
}

export default Colorable

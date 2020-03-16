import { VNode, VNodeDirective } from 'vue'
import { consoleWarn } from '../../util/console'
import colors from '../../util/colors'

interface BorderModifiers {
  top?: Boolean
  right?: Boolean
  bottom?: Boolean
  left?: Boolean
}

function isCssColor (color?: string | false): boolean {
  return !!color && !!color.match(/^(#|var\(--|(rgb|hsl)a?\()/)
}

function classToHex (color: string): string {
  const [colorName, colorModifier] = color
    .toString().trim().replace('-', '').split(' ', 2) as (string | undefined)[]
  const hexColor = colorModifier
    ? colors[colorName][colorModifier] : colors[colorName].base

  return hexColor
}

function setBackgroundColor (el: HTMLElement, color?: string | false) {
  const setColor = (v: string) => {
    el.style.backgroundColor = v
    el.style.borderColor = v
  }

  if (isCssColor(color)) setColor(color)
  else if (color) setColor(classToHex(color))
}

function setTextColor (el: HTMLElement, color?: string | false) {
  const setColor = (v: string) => {
    el.style.color = v
    el.style.caretColor = v
  }

  if (isCssColor(color)) setColor(color)
  else if (color) setColor(classToHex(color))
}

function setBorderColor (
  el: HTMLElement,
  color?: string | false,
  modifiers?: BorderModifiers
) {
  const hasModifiers = Object.keys(modifiers).length > 0

  const setColor = (v: string) => el.style.borderColor = v
  const setSidesColor = (v: string) => {
    if (modifiers.top) el.style.borderTopColor = v
    if (modifiers.right) el.style.borderRightColor = v
    if (modifiers.bottom) el.style.borderBottomColor = v
    if (modifiers.left) el.style.borderLeftColor = v
  }

  if (isCssColor(color)) {
    if (hasModifiers) setSidesColor(color)
    else setColor(color)
  } else if (color) {
    const hexColor = classToHex(color)

    if (hasModifiers) setSidesColor(hexColor)
    else setColor(hexColor)
  }
}

function updateColor (el: HTMLElement, binding: VNodeDirective) {
  if (binding.arg === 'bg') setBackgroundColor(el, binding.value)
  else if (binding.arg === 'text') setTextColor(el, binding.value)
  else if (binding.arg === 'border') setBorderColor(el, binding.value, binding.modifiers)
}

function directive (el: HTMLElement, binding: VNodeDirective, node: VNode) {
  updateColor(el, binding)
}

function update (el: HTMLElement, binding: VNodeDirective) {
  if (binding.value === binding.oldValue) {
    return
  }

  updateColor(el, binding)
}

export const Colorable = {
  bind: directive,
  update,
}

export default Colorable

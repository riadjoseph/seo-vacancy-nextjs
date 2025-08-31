'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface BuyMeACoffeeProps {
  username?: string
  color?: string
  emoji?: string
  font?: string
  text?: string
  outlineColor?: string
  fontColor?: string
  coffeeColor?: string
  className?: string
  onLoad?: () => void
}

export function BuyMeACoffeeButton({
  username = 'riadjoseph',
  color = '#FFDD00',
  emoji = '☕',
  font = 'Cookie',
  text = 'Buy me a coffee',
  outlineColor = '#000000',
  fontColor = '#000000',
  coffeeColor = '#ffffff',
  className = '',
  onLoad
}: BuyMeACoffeeProps) {
  return (
    <div className={className}>
      <Script
        src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
        data-name="bmc-button"
        data-slug={username}
        data-color={color}
        data-emoji={emoji}
        data-font={font}
        data-text={text}
        data-outline-color={outlineColor}
        data-font-color={fontColor}
        data-coffee-color={coffeeColor}
        onLoad={() => {
          // Button will be rendered by the script
          if (onLoad) {
            onLoad()
          }
        }}
      />
    </div>
  )
}

interface BuyMeACoffeeWidgetProps {
  username?: string
  description?: string
  message?: string
  color?: string
  position?: 'left' | 'right'
  xMargin?: number
  yMargin?: number
}

export function BuyMeACoffeeWidget({
  username = 'riadjoseph',
  description = 'Support WakeUpHappy!',
  message = '',
  color = '#5F7FFF',
  position = 'right',
  xMargin = 18,
  yMargin = 18
}: BuyMeACoffeeWidgetProps) {
  return (
    <Script
      src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
      data-name="BMC-Widget"
      data-cfasync="false"
      data-id={username}
      data-description={description}
      data-message={message}
      data-color={color}
      data-position={position}
      data-x_margin={xMargin.toString()}
      data-y_margin={yMargin.toString()}
    />
  )
}
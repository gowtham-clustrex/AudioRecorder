import * as React from "react"
import Svg, { Rect, Circle, Defs, RadialGradient, Stop } from "react-native-svg"

function Loader(props) {
  return (
    <Svg
      width={355}
      height={21}
      viewBox="0 0 355 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        y={7}
        width={355}
        height={8}
        rx={4}
        fill="#A7ACCB"
        fillOpacity={0.3}
      />
      <Rect
        y={7}
        width={267.674}
        height={8}
        rx={4}
        fill="url(#paint0_radial_39_83)"
      />
      <Rect x={251.537} width={19.9332} height={21} rx={9.96658} fill="#fff" />
      <Circle cx={261.504} cy={10.5} r={6} fill="#A421D2" />
      <Defs>
        <RadialGradient
          id="paint0_radial_39_83"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-267.674 0 0 -9940.5 267.674 11)"
        >
          <Stop stopColor="#A320D1" />
          <Stop offset={0.494001} stopColor="#A320D1" />
          <Stop offset={1} stopColor="#2602FF" />
        </RadialGradient>
      </Defs>
    </Svg>
  )
}

export default Loader

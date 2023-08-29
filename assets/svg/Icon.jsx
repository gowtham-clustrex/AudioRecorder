import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

function Icon(props) {
  return (
    <Svg
      width={150}
      height={150}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M27.196 102.196c-15.02-15.02-15.02-39.372 0-54.392l20.608-20.608c15.02-15.02 39.372-15.02 54.392 0l20.608 20.607c15.02 15.02 15.02 39.373 0 54.393l-20.608 20.608c-15.02 15.02-39.372 15.02-54.392 0l-20.608-20.608z"
        fill="url(#paint0_linear_220_36)"
      />
      <Path
        opacity={0.25}
        d="M28.846 67.308c0-21.242 17.22-38.462 38.462-38.462h28.846c21.241 0 38.461 17.22 38.461 38.462v28.846c0 21.242-17.22 38.461-38.461 38.461H67.308c-21.242 0-38.462-17.219-38.462-38.461V67.308z"
        fill="#FF334B"
      />
      <Path
        opacity={0.25}
        d="M15.385 53.846c0-21.242 17.22-38.461 38.461-38.461h28.846c21.242 0 38.462 17.22 38.462 38.461v28.846c0 21.242-17.22 38.462-38.462 38.462H53.846c-21.241 0-38.461-17.22-38.461-38.462V53.846z"
        fill="#3369FF"
      />
      <Path
        d="M98.477 69.35c-.864-.227-1.752.276-1.984 1.126l-2.618 9.609C91.103 90.25 80.438 96.305 70.099 93.58c-10.34-2.723-16.497-13.21-13.727-23.375l2.619-9.609a1.59 1.59 0 00-1.145-1.95c-.864-.227-1.752.277-1.983 1.126l-2.62 9.61C50.153 80.724 56.59 92.41 67.713 96.187l-2.176 7.983-8.091-2.131a1.622 1.622 0 00-1.983 1.126 1.59 1.59 0 001.145 1.95l19.31 5.087c.864.227 1.752-.277 1.983-1.126a1.589 1.589 0 00-1.145-1.95l-8.09-2.131 2.175-7.983c11.553 2.195 23.071-4.76 26.163-16.104l2.618-9.61a1.59 1.59 0 00-1.144-1.949z"
        fill="#fff"
      />
      <Path
        d="M85.157 42.427l-2.084-.55c-7.151-1.883-14.527 2.304-16.443 9.334L60.834 72.48c-1.917 7.03 2.342 14.282 9.493 16.166l2.085.55c7.15 1.883 14.527-2.304 16.443-9.334l5.796-21.268c1.916-7.03-2.343-14.282-9.493-16.166zm5.278 19.334l-5.67-1.494c-.865-.227-1.752.277-1.984 1.126a1.59 1.59 0 001.145 1.95l5.67 1.494-1.166 4.28-5.67-1.493c-.864-.228-1.752.276-1.984 1.126a1.59 1.59 0 001.145 1.95l5.67 1.493-1.166 4.281-5.67-1.494c-.864-.227-1.752.277-1.984 1.126a1.59 1.59 0 001.145 1.95l5.656 1.49c-1.66 5.025-7.071 7.956-12.322 6.573l-2.085-.55c-5.25-1.383-8.446-6.58-7.329-11.749l5.656 1.49c.864.228 1.752-.276 1.984-1.126a1.59 1.59 0 00-1.145-1.95l-5.67-1.493 1.166-4.281 5.67 1.493c.864.228 1.752-.276 1.984-1.126a1.59 1.59 0 00-1.145-1.95l-5.67-1.493 1.166-4.28 5.67 1.493c.864.227 1.752-.276 1.984-1.126a1.59 1.59 0 00-1.145-1.95l-5.67-1.494 1.087-3.991c1.045-3.834 4.23-6.554 7.953-7.25l-1.185 4.348a1.59 1.59 0 001.145 1.95c.864.228 1.752-.276 1.983-1.126l1.428-5.237c.384.056 3.993 1.007 4.354 1.147l-1.428 5.237a1.59 1.59 0 001.146 1.95c.863.228 1.752-.276 1.983-1.126l1.185-4.347c2.87 2.433 4.245 6.353 3.2 10.187l-1.087 3.992z"
        fill="#fff"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_220_36"
          x1={74.9105}
          y1={0.0895758}
          x2={74.9105}
          y2={150.09}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FF334B" />
          <Stop offset={0.46875} stopColor="#C600F9" />
          <Stop offset={1} stopColor="#3369FF" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default Icon
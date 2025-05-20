import React from 'react'

function GlowingBG({color, position}) {
  return (
    <div className={`absolute w-[30rem] h-[30rem] ${color} rounded-full opacity-30 blur-3xl ${position} animate-pulse`} />
  )
}

export default GlowingBG
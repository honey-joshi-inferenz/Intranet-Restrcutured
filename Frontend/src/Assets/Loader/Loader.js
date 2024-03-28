import React from 'react'
import { TailSpin } from 'react-loader-spinner'

export const Loader = () => {
  return (
    <div className="mx-2">
      <TailSpin
        height="20"
        width="20"
        color="white"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  )
}

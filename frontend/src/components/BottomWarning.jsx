/* eslint-disable react/prop-types */

import { Link } from "react-router-dom"


export const BottomWarning = ({label, route, htext}) => {
  return (
    <div className="text-sm pb-4 flex justify-center">
        <div>
            {label}
        </div>
        <Link to={route} className="pointer underline pl-1 cursor-pointer">{htext}</Link>
    </div>
  )
}

/* eslint-disable react/prop-types */


export const InputBox = ({placeholder, label, onChange}) => {
  return (
    <div>
        <div className="text-sm font-medium text-left py-2">
            {label}
        </div>
        <input onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border border-slate-200 rounded"/>
    </div>
  )
}

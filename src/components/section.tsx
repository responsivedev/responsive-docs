export default function Section({children, className}) {
    return <div className={'p-4 rounded-lg border-2 border-b-4 border-gray-500 border-solid ' + className}>
        {children}
    </div>
}
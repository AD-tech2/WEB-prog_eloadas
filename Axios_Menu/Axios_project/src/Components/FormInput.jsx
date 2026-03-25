export default function FormElement({ListOfInputConfs = [], IsNextToLabel = false}) {
    if(IsNextToLabel)
        return (
            <>
                {ListOfInputConfs.map((elem, num) => {
                    return (
                        <label key={num}>
                            {elem.label}
                            <input type={elem.type} placeholder={elem.holder} ref={elem.ref}/>
                        </label>
                    );
                })}
            </>
        );
    return (
        <>
            {ListOfInputConfs.map((elem, num) => {
                return (
                    <label key={num}>
                        {elem.label} <br/>
                        <input type={elem.type} placeholder={elem.holder} ref={elem.ref}/> <br />
                    </label>
                );
            })}
        </>
    );
}
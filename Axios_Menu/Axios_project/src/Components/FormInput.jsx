export default function FormElement({ListOfInputConfs = [], OnSave, IsNextToLabel = false}) {
    if(IsNextToLabel)
        return (
            <form onSubmit={(e) => { e.preventDefault(); OnSave(); }}>
                {ListOfInputConfs.map((elem, num) => {
                    return (
                        <label key={num}>
                            {elem.label}
                            <input type={elem.type} placeholder={elem.holder} ref={elem.ref} required={elem.notnull ?? false}/>
                        </label>
                    );
                })}
                <button type="submit">Save</button>
            </form>
        );
    return (
        <form onSubmit={(e) => { e.preventDefault(); OnSave(); }}>
            {ListOfInputConfs.map((elem, num) => {
                return (
                    <label key={num}>
                        {elem.label} <br/>
                        <input type={elem.type} placeholder={elem.holder} ref={elem.ref} required={elem.notnull ?? false}/> <br />
                    </label>
                );
            })}
            <button type="submit">Save</button>
        </form>
    );
}
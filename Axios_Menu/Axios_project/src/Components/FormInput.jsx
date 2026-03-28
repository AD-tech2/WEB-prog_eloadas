export default function FormElement({ListOfInputConfs = [], IsNextToLabel = false, OnSave, OnReset = { Available: false, Reseter: null}}) {
    if(IsNextToLabel)
        return (
            <>
                {OnReset.Available && <h2>Updating</h2>}
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
                    {OnReset.Available && <button onClick={() => {
                        OnReset.Reseter();
                    }}>Cancel</button>}
                </form>
            </>
        );
    return (
        <>
            {OnReset.Available && <h2>Updating</h2>}
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
                {OnReset.Available && <button onClick={() => { OnReset.Reseter(); }}>Cancel</button>}
            </form>
        </>
    );
}
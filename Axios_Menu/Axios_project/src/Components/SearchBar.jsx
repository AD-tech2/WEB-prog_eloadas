import { useRef } from "react";

//Az a lényeg hogy ez folyamason renderelteti ha van új elem amit rendereljen!
function DynamicInput({ ValueGetter, Search, EmptySearch }) {
    return (
        <input placeholder="Search..." onChange={(e) => {
                if(e.target.value !== "") Search({
                    Column: ValueGetter().Column,
                    Value: e.target.value        
                });
                else EmptySearch();
        }}/>
    );
}

//Ez csak gombnyomsára keres szóval nem render és adatbázis erőigényes annyira mint a dinamikus!
function StaticInput({ ValueSetter, ValueGetter }) {
    return (
        <input placeholder="Search..." onChange={(e) => {
                if(e.target.value !== "")
                    ValueSetter({
                        Column: ValueGetter().Column,
                        Value: e.target.value
                    });
                else
                    ValueSetter({
                        Column: ValueGetter().Column,
                        Value: null
                    });
        }}/>
    );
}

export default function SearchBar({ Label = "", OptionsToSearch = [], Dynamic = true, OnSearch, OnNullSearch }) {
    if(OptionsToSearch.length === 0 || OptionsToSearch === null)
        throw new Error("Unable to create an empty SearchBar!");
    const InputToSearch = useRef({
        Column: OptionsToSearch[0],
        Value: null
    });
    const GetSearch = () => InputToSearch.current;
    const SetSearch = (NewInput) => { InputToSearch.current = NewInput; };
    return (
        <div className="SearchBar">
            {(Label !== null && Label != "") && <h4>{Label}</h4>}
            { Dynamic &&
                <DynamicInput
                    ValueGetter={GetSearch}
                    Search={OnSearch}
                    EmptySearch={OnNullSearch}
                />
            }
            { !Dynamic &&
                <StaticInput 
                    ValueSetter={SetSearch}
                    ValueGetter={GetSearch}
                />
            }
            <select onChange={e => SetSearch({
                Column: e.target.value,
                Value: GetSearch().Value
            })}>
                {OptionsToSearch.map((Option, num) => {
                    return ( <option key={num} value={Option}>{Option}</option> );
                })}
            </select>
            { !Dynamic &&
                <button onClick={() => {
                    const ToSearch = GetSearch();
                    if(ToSearch.Value !== null)
                        OnSearch(ToSearch);
                    else OnNullSearch();
                }}>Search</button>
            }
        </div>
    );
}
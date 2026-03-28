import { useRef, useState } from "react";

export default function SearchBar({ Label = "", OptionsToSearch = [], OnSearch, OnNullSearch }) {
    if(OptionsToSearch.length === 0 || OptionsToSearch === null)
        throw new Error("Unable to create an empty SearchBar!");
    const InputToSearch = useRef({
        Column: OptionsToSearch[0],
        Value: null
    });
    const GetSearch = () => InputToSearch.current;
    const SetSearch = (NewInput) => { InputToSearch.current = NewInput; };
    return (
        <>
            {(Label !== null && Label != "") && <h4>{Label}</h4>}
            <input placeholder="Search..." onChange={(e) => {
                if(e.target.value !== "")
                    SetSearch({
                        Column: GetSearch().Column,
                        Value: e.target.value
                    });
                else
                    SetSearch({
                        Column: GetSearch().Column,
                        Value: null
                    });
            }}/>
            <select onChange={e => SetSearch({
                Column: e.target.value,
                Value: GetSearch().Value
            })}>
                {OptionsToSearch.map((Option, num) => {
                    return ( <option key={num} value={Option}>{Option}</option> );
                })}
            </select>
            <button onClick={() => {
                const ToSearch = GetSearch();
                console.log(ToSearch);
                if(ToSearch.Value !== null)
                    OnSearch(ToSearch);
                else OnNullSearch();
            }}>Search</button>
        </>
    );
}
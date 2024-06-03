const Search = (props) => {
    return (
        <div className={props.className}>
            <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-secondary" type="button">Search</button>
            </form>
        </div>
    );
}

export default Search;
